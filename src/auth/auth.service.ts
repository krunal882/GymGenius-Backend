import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { deleteOne, updateOne } from 'src/factoryFunction';
import { updateUser } from './dto/user-update.dto';

import { Cron } from '@nestjs/schedule';
import { MailerService } from 'src/mailer/mailer.service';
import { ChangePasswordDto } from './dto/password-change.dto';

interface QueryParams {
  name?: string;
  email?: string;
  age?: number;
  role?: string;
  state?: string;
  number?: string;
  id?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: mongoose.Model<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signup(createUserDto: CreateUserDto, res: Response): Promise<void> {
    const { password, confirmPassword, email } = createUserDto;
    const existingUser = await this.UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email address is already in use');
    }

    if (password.trim() !== confirmPassword.trim()) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }
    const user = await this.UserModel.create({
      ...createUserDto,
      state: 'active',
      role: 'user',
    });

    const payload = { email: user.email, role: user.role, userId: user._id };

    const token = await this.jwtService.signAsync(payload);

    res.json({
      token,
      user,
    });
  }

  async login(loginUserDto: LoginUserDto, res: Response): Promise<void> {
    const user = await this.UserModel.findOne({
      email: loginUserDto.email,
    }).select('+password');

    if (
      !user ||
      !(await await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      throw new UnauthorizedException('Please enter valid email or password ');
    }

    if (user.state !== 'active') {
      throw new UnauthorizedException('Your account is currently inactive');
    }

    const payload = { email: user.email, role: user.role, userId: user._id };

    const token = await this.jwtService.signAsync(payload);

    res.json({
      token,
    });
  }

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<{ total: number; users: User[] }> {
    const skip = (page - 1) * limit;
    const users = await this.UserModel.find()
      .select('_id name email age number role state')
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.UserModel.countDocuments();
    return { users, total };
  }

  async getFilteredUser(queryParams: QueryParams): Promise<User[]> {
    const filter: any = {};

    const filterableKeys = [
      'name',
      'email',
      'age',
      'role',
      'state',
      'number',
      '_id',
    ];
    filterableKeys.forEach((key) => {
      if (queryParams[key]) {
        filter[key] = queryParams[key];
      }
    });
    return await this.UserModel.find(filter).select('-password -_id -state');
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const resetToken = await this.generateResetToken(user);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour
    user.save();

    const resetURL = `http://localhost:8081/resetPassword/${resetToken}`;
    const message = `Forgot your password? Click <a href="${resetURL}">here</a> to reset your password.`;

    await this.mailerService.sendEmail({
      recipients: user.email,
      subject: 'Password Reset',
      html: message,
    });
    return resetToken;
  }

  async resetPassword(
    resetPasswordToken: string,
    newPassword: string,
    newConfirmPassword: string,
  ): Promise<string> {
    const user = await this.UserModel.findOne({ resetPasswordToken });
    if (!user) {
      throw new BadRequestException('invalid token or token expired');
    }
    user.password = newPassword;
    user.confirmPassword = newConfirmPassword;
    await user.save();
    return 'password changed successfully : new password:' + user.password;
  }

  private async generateResetToken(
    loginUserDto: LoginUserDto,
  ): Promise<string> {
    const user = await this.UserModel.findOne({
      email: loginUserDto.email,
    }).select('+password');
    const payload = { email: user.email, role: user.role, userId: user._id };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  async addUser(createUserDto: CreateUserDto, res: Response): Promise<void> {
    const { password, confirmPassword, email } = createUserDto;
    const existingUser = await this.UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email address is already in use');
    }
    if (password.trim() !== confirmPassword.trim()) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const user = await this.UserModel.create(createUserDto);
    res.json(user);
  }

  async deleteUser(id: mongoose.Types.ObjectId, role: string): Promise<string> {
    const user = await this.UserModel.findById(id);

    if (role === 'owner') {
      await deleteOne(this.UserModel, id);
      return 'Successfully deleted user';
    } else if (role === 'user') {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new NotAcceptableException('Invalid ID');
      }
      try {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        user.state = 'inactive';
        user.deletionTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 day deletion time
        await user.save();
        return 'User deletion scheduled';
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw new NotFoundException('user not found');
        } else {
          throw new BadRequestException(
            'Status Failed!! Error while Delete operation',
          );
        }
      }
    }
  }

  @Cron('0 0 * * *') // Runs every day at midnight
  async deleteInactiveUsers() {
    try {
      const deletionTimeThreshold = new Date(Date.now());
      const result = await this.UserModel.deleteMany({
        state: 'inactive',
        deletionTime: { $lte: deletionTimeThreshold },
      });

      return `${result.deletedCount} inactive users deleted`;
    } catch (error) {
      throw new Error('Error deleting inactive users: ' + error.message);
    }
  }

  async uploadImage(userId: string, imgUrl: string): Promise<string> {
    try {
      const user = await this.UserModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.src = imgUrl;
      await user.save();

      return user.src;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(
    id: mongoose.Types.ObjectId,
    updateData: updateUser,
  ): Promise<User> {
    return await updateOne(this.UserModel, id, updateData);
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    const { userId, oldPassword, newPassword } = changePasswordDto;
    const user = await this.UserModel.findById(userId).exec();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordMatching = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatching) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  }
}

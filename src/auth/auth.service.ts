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
import { updateOne } from 'src/factoryFunction';
import { updateUser } from './dto/user-update.dto';
import * as path from 'path';
import * as sharp from 'sharp';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: mongoose.Model<User>,
    private jwtService: JwtService,
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

    // res.cookie('Authorization', ` ${token}`, {
    //   httpOnly: true,
    //   // maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    // });

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

    // res.set('Authorization', `Bearer ${token}`);

    // res.cookie('Authorization', `Bearer ${token}`, {
    //   httpOnly: true,
    //   // maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    // });

    res.json({
      token,
      // user,
    });
  }

  async getAllUsers(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    const users = await this.UserModel.find()
      .select('_id name email age number role state')
      .skip(skip)
      .limit(limit)
      .exec();
    return users;
  }

  async getFilteredUser(queryParams: any): Promise<User[]> {
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
    return await this.UserModel.find(filter);
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const resetToken = this.generateResetToken(user);

    user.resetPasswordToken = await resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour
    user.save();

    // const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;
    // const message = `Forgot your password? Click <a href="${resetURL}">here</a> to reset your password.`;

    // await sendMail({
    //   to: user.email,
    //   subject: 'Password Reset',
    //   html: message,
    // });
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
    // const resetToken = this.generateResetToken(user);

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

  async deleteUser(id: any): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    try {
      const user = await this.UserModel.findById(id);
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

  async uploadFile(
    file: Express.Multer.File,
    id: string,
    res: Response,
  ): Promise<void> {
    try {
      const destination = path.resolve(
        __dirname,
        `../../../../fontend-bootstrap/public/assets/profilePic/${file.originalname}`,
      );
      await sharp(file.buffer)
        .resize(300, 300)
        .toFormat('jpeg')
        .toFile(destination);

      await this.UserModel.updateOne(
        { _id: id },
        { profilePicture: file.originalname },
      );
      res.sendFile(destination);
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).send('Error uploading image');
    }
  }

  async updateUser(
    id: mongoose.Types.ObjectId,
    updateData: updateUser,
  ): Promise<User> {
    return await updateOne(this.UserModel, id, updateData);
  }
}

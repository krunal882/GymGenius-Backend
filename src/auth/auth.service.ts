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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password, confirmPassword } = createUserDto;

    if (password.trim() !== confirmPassword.trim()) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }
    const user = this.UserModel.create(createUserDto);

    return user;
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

    const payload = { email: user.email, role: user.role, userId: user._id };

    const token = await this.jwtService.signAsync(payload);

    res.set('Authorization', `Bearer ${token}`);

    res.json({
      token,
    });
  }

  async getAllUser(): Promise<User[]> {
    const users = await this.UserModel.find();
    return users;
  }

  async getFilteredUser(queryParams: any): Promise<User[]> {
    const filter: any = {}; // Initialize an empty filter object

    const filterableKeys = ['name', 'email', 'age', 'role', 'state'];
    // Check if each query parameter exists and add it to the filter if present

    filterableKeys.forEach((key) => {
      if (queryParams[key]) {
        filter[key] = queryParams[key];
      }
    });
    // Execute the query with the constructed filter
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
    return resetToken;

    // const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
    // const message = `Forgot your password? Click <a href="${resetURL}">here</a> to reset your password.`;

    // await sendEmail({
    //   to: user.email,
    //   subject: 'Password Reset',
    //   html: message,
    // });
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
      await deleteOne(this.UserModel, id);
      return 'Successfully deleted user';
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

  async updateUser(
    id: mongoose.Types.ObjectId,
    updateData: updateUser,
  ): Promise<User> {
    return await updateOne(this.UserModel, id, updateData);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import mongoose from 'mongoose';
import { updateUser } from './dto/user-update.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signup(createUserDto);
  }

  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ): Promise<void> {
    return await this.authService.login(loginUserDto, res);
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body() body: { email: string }): Promise<string> {
    const { email } = body;
    return await this.authService.forgotPassword(email);
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body('resetPasswordToken') resetPasswordToken: string,
    @Body('newPassword') newPassword: string,
    @Body('newConfirmPassword') newConfirmPassword: string,
  ): Promise<string> {
    return await this.authService.resetPassword(
      resetPasswordToken,
      newPassword,
      newConfirmPassword,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/users')
  async getAllUser() {
    return await this.authService.getAllUser();
  }

  @Get('/filtered')
  async getFilteredUser(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('age') age: number,
    @Query('role') role: string,
    @Query('state') state: string,
  ) {
    const queryParams = {
      name,
      email,
      age,
      role,
      state,
    };
    return await this.authService.getFilteredUser(queryParams);
  }

  @Delete('/deleteUser')
  async deleteUser(@Query('id') id: string): Promise<string> {
    this.authService.deleteUser(id);
    return 'exercise deleted successfully';
  }

  @Patch('/updateUser')
  async updateUser(
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateUser,
  ): Promise<string> {
    await this.authService.updateUser(id, updateData);
    return 'user updated successfully';
  }
}

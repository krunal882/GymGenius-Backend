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
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import mongoose from 'mongoose';
import { updateUser } from './dto/user-update.dto';
import { AuthGuard } from './auth.guard';
import * as path from 'path';

interface FileParams {
  fileName: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    return this.authService.signup(createUserDto, res);
  }

  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ): Promise<void> {
    return await this.authService.login(loginUserDto, res);
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body('email') email: string): Promise<string> {
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
  async getAllUsers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.authService.getAllUsers(page, limit);
  }

  @UseGuards(AuthGuard)
  @Get('/filtered')
  async getFilteredUser(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('age') age: number,
    @Query('number') number: string,
    @Query('role') role: string,
    @Query('state') state: string,
    @Query('id') _id: string,
  ) {
    const queryParams = {
      name,
      email,
      age,
      number,
      role,
      state,
      _id,
    };
    return await this.authService.getFilteredUser(queryParams);
  }

  @UseGuards(AuthGuard)
  @Post('/addUser')
  async addUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    return this.authService.addUser(createUserDto, res);
  }

  // @UseGuards(AuthGuard)
  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadImg(
  //   @Res() res: Response,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body('id') id: string,
  // ) {
  //   await this.authService.uploadFile(file, id, res);
  // }

  @UseGuards(AuthGuard)
  @Post('/upload')
  async uploadImage(
    @Body() body: { userId: string; imgUrl: string },
  ): Promise<string> {
    const { userId, imgUrl } = body;
    return await this.authService.uploadImage(userId, imgUrl);
  }

  @UseGuards(AuthGuard)
  @Get('/getImg')
  getFile(@Res() res: Response, @Body() file: FileParams) {
    res.sendFile(path.join(__dirname, '../../profilePic/' + file.fileName));
  }

  @UseGuards(AuthGuard)
  @Delete('/deleteUser')
  async deleteUser(
    @Query('id') id: string,
    @Query('role') role: string,
  ): Promise<string> {
    this.authService.deleteUser(id, role);
    return 'user deleted successfully';
  }

  @UseGuards(AuthGuard)
  @Patch('/updateUser')
  async updateUser(
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateUser,
  ): Promise<string> {
    await this.authService.updateUser(id, updateData);
    return 'user updated successfully';
  }
}

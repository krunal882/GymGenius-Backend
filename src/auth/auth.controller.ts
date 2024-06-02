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
} from '@nestjs/common'; // Import necessary decorators and utilities from @nestjs/common
import { AuthService } from './auth.service'; // Import AuthService
import { CreateUserDto } from './dto/create-user.dto'; // Import CreateUserDto
import { LoginUserDto } from './dto/login-user.dto'; // Import LoginUserDto
import { Response } from 'express'; // Import Response from express
import mongoose from 'mongoose'; // Import mongoose
import { updateUser } from './dto/user-update.dto'; // Import updateUser DTO
import { AuthGuard } from './auth.guard'; // Import AuthGuard
import { ChangePasswordDto } from './dto/password-change.dto'; // Import ChangePasswordDto
import { User } from './schema/user.schema'; // Import User schema
import { QueryParams } from './auth.service';
// Define the AuthController to handle authentication-related requests
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {} // Inject AuthService

  // Endpoint to handle user signup
  @Post('/signup')
  async signup(
    @Body() createUserDto: CreateUserDto, // Validate request body with CreateUserDto
    @Res() res: Response, // Inject Response object
  ): Promise<void> {
    return await this.authService.signup(createUserDto, res); // Call signup method from AuthService
  }

  // Endpoint to handle user login
  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto, // Validate request body with LoginUserDto
    @Res() res: Response, // Inject Response object
  ): Promise<void> {
    return await this.authService.login(loginUserDto, res); // Call login method from AuthService
  }

  // Endpoint to handle forgot password
  @Post('/forgotPassword')
  async forgotPassword(@Body('email') email: string): Promise<string> {
    return await this.authService.forgotPassword(email); // Call forgotPassword method from AuthService
  }

  // Endpoint to handle reset password
  @Post('/resetPassword')
  async resetPassword(
    @Body('resetPasswordToken') resetPasswordToken: string, // Get resetPasswordToken from request body
    @Body('newPassword') newPassword: string, // Get newPassword from request body
    @Body('newConfirmPassword') newConfirmPassword: string, // Get newConfirmPassword from request body
  ): Promise<string> {
    return await this.authService.resetPassword(
      resetPasswordToken,
      newPassword,
      newConfirmPassword,
    ); // Call resetPassword method from AuthService
  }

  // Endpoint to get all users, protected by AuthGuard
  @UseGuards(AuthGuard)
  @Get('/users')
  async getAllUsers(
    @Query('page', ParseIntPipe) page: number = 1, // Parse page query parameter as integer
    @Query('limit', ParseIntPipe) limit: number = 10, // Parse limit query parameter as integer
  ) {
    return await this.authService.getAllUsers(page, limit); // Call getAllUsers method from AuthService
  }

  // Endpoint to get filtered users
  @UseGuards(AuthGuard)
  @Get('/filtered')
  async getFilteredUser(@Query() queryParams: QueryParams) {
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

  // Endpoint to upload an image, protected by AuthGuard
  @UseGuards(AuthGuard)
  @Post('/upload')
  async uploadImage(
    @Body() body: { userId: string; imgUrl: string }, // Get userId and imgUrl from request body
  ): Promise<string> {
    const { userId, imgUrl } = body;
    return await this.authService.uploadImage(userId, imgUrl); // Call uploadImage method from AuthService
  }

  // Endpoint to delete a user, protected by AuthGuard
  @UseGuards(AuthGuard)
  @Delete('/deleteUser')
  async deleteUser(
    @Query('id') id: mongoose.Types.ObjectId, // Get user id from query parameters
    @Query('role') role: string, // Get user role from query parameters
  ): Promise<string> {
    return await this.authService.deleteUser(id, role); // Call deleteUser method from AuthService
  }

  // Endpoint to update user details, protected by AuthGuard
  @UseGuards(AuthGuard)
  @Patch('/updateUser')
  async updateUser(
    @Query('id') id: mongoose.Types.ObjectId, // Get user id from query parameters
    @Body() updateData: updateUser, // Validate request body with updateUser DTO
  ): Promise<User> {
    return await this.authService.updateUser(id, updateData); // Call updateUser method from AuthService
  }

  // Endpoint to change password, protected by AuthGuard
  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(changePasswordDto); // Call changePassword method from AuthService
  }
}

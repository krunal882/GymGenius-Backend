import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { MailerService } from '../mailer/mailer.service';

@Module({
  // Import MongooseModule and define the User model with UserSchema
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, MailerService],
  exports: [AuthService], // Export AuthService to be used in other modules
})
export class AuthModule {}

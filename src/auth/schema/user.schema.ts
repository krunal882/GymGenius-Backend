// Import necessary decorators and utilities from @nestjs/mongoose and mongoose
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

@Schema()
export class User extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, min: 12, type: Number })
  age: number;

  @Prop({ required: true, type: String })
  number: string;

  @Prop({ default: 'user', type: String }) // Role is optional, defaults to 'user', and must be a string
  role: string;

  @Prop({ type: String }) // Profile image source is optional and must be a string
  src: string;

  @Prop({ required: true, select: false, type: String })
  password: string;

  @Prop({ default: 'active', type: String }) // State is optional, defaults to 'active', and must be a string
  state: string;

  @Prop() // Deletion time is optional and of Date type
  deletionTime: Date;

  @Prop({ type: String }) // Password confirmation is optional and must be a string
  confirmPassword: string;

  @Prop({ select: false }) // Reset password token is optional and not selected by default
  resetPasswordToken: string;

  @Prop() // Reset password expiry time is optional and of Date type
  resetPasswordExpires: Date;

  @Prop() // Password change time is optional and of Date type
  passwordChangedAt: Date;
}

// Create the schema for the User class
export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save middleware to hash the password before saving if it has been modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); // Hash the password with bcrypt

  this.confirmPassword = undefined; // Do not save confirmPassword field to the database
  next();
});

// Pre-save middleware to update passwordChangedAt field before saving if the password has been modified and the document is not new
UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);

  next();
});

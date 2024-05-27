import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, min: 12 })
  age: number;

  @Prop({ required: true })
  number: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  src: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: 'active' })
  state: string;

  @Prop()
  deletionTime: Date;

  @Prop()
  confirmPassword: string;

  @Prop({ select: false })
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  @Prop()
  passwordChangedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);

  next();
});

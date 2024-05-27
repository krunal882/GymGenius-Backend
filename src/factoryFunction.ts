import { BadRequestException, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

type Model<T> = mongoose.Model<T>;

export const getAll = async <T>(
  model: Model<T>,
  options?: any,
): Promise<T[] | null> => {
  return await model.find({ options });
};

export const createOne = async <T>(
  model: Model<T>,
  bodyData: any,
): Promise<T | null> => {
  return await model.create(bodyData);
};

export const updateOne = async <T>(
  model: Model<T>,
  id: mongoose.Types.ObjectId,
  updateData: any,
): Promise<T | null> => {
  const keys: string[] = Object.keys(updateData);
  if (keys.includes('password') || keys.includes('passwordConfirm')) {
    throw new BadRequestException('You can not directly change password ');
  }
  const updatedItem = await model.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true },
  );
  if (!updatedItem) {
    throw new NotFoundException('Item not found');
  }
  return updatedItem;
};

export const deleteOne = async <T>(
  model: Model<T>,
  id: mongoose.Types.ObjectId,
): Promise<void> => {
  const deleteItem = await model.findByIdAndDelete(id);
  if (!deleteItem)
    throw new BadRequestException(
      'Status Failed!! Error while Delete operation',
    );
};

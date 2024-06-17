import { BadRequestException, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

// Define a type alias for mongoose.Model<T> for convenience
type Model<T> = mongoose.Model<T>;

// Function to fetch all documents from a collection
export const getAll = async <T>(
  model: Model<T>, // Mongoose model for the collection
  options?: any, // Optional query options
): Promise<T[] | null> => {
  return await model.find({ options });
};

// Function to create a new document in the collection
export const createOne = async <T>(
  model: Model<T>,
  bodyData: any, // Data for creating the document
): Promise<T | null> => {
  return await model.create(bodyData);
};

// Function to update an existing document in the collection
export const updateOne = async <T>(
  model: Model<T>,
  id: mongoose.Types.ObjectId, // ID of the document to update
  updateData: any,
): Promise<T | null> => {
  // Check if updateData contains sensitive fields like password
  const keys: string[] = Object.keys(updateData);
  if (keys.includes('password') || keys.includes('passwordConfirm')) {
    throw new BadRequestException('You cannot directly change the password');
  }

  // Update the document and return the updated item
  const updatedItem = await model.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }, // Return the updated document after update
  );

  // If the document doesn't exist, throw a NotFoundException
  if (!updatedItem) {
    throw new NotFoundException('Item not found');
  }
  return updatedItem;
};

// Function to delete a document from the collection
export const deleteOne = async <T>(
  model: Model<T>,
  id: mongoose.Types.ObjectId, // ID of the document to delete
): Promise<void> => {
  // Find and delete the document by ID
  const deleteItem = await model.findByIdAndDelete(id);

  // If the document doesn't exist, throw a BadRequestException
  if (!deleteItem) {
    throw new BadRequestException('Error while deleting the item');
  }
};

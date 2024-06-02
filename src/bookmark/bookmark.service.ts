import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'; // Import necessary decorators from '@nestjs/common'
import { bookmark } from './dto/bookmark.dto';
import { Bookmark } from './schema/bookmark.schema';
import mongoose from 'mongoose';
import { createOne } from 'src/factoryFunction';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: mongoose.Model<Bookmark>, // Inject Bookmark model
  ) {}

  async addBookmark(bookmarkDto: bookmark): Promise<void> {
    const filter = { userId: bookmarkDto.userId }; // Define filter to find existing user

    const existingUser = await this.bookmarkModel.findOne(filter); // Find existing user
    if (existingUser) {
      const itemType = bookmarkDto.itemType as keyof typeof existingUser.item; // Determine the type of item
      const updateOperation = existingUser.item[itemType]
        ? { $addToSet: { [`item.${itemType}`]: bookmarkDto.itemId } } // If item type exists, add to set
        : { $set: { [`item.${itemType}`]: [bookmarkDto.itemId] } }; // If item type doesn't exist, set new array
      await this.bookmarkModel.updateOne(filter, updateOperation);
    } else {
      // If user doesn't exist, create new user with bookmark
      await createOne(this.bookmarkModel, {
        userId: bookmarkDto.userId,
        item: {
          ...(bookmarkDto.itemType
            ? { [bookmarkDto.itemType]: [bookmarkDto.itemId] }
            : {}),
        },
      });
    }
  }

  async undoBookmark(bookmarkDto: bookmark): Promise<void> {
    const filter = { userId: bookmarkDto.userId };

    const existingUser = await this.bookmarkModel.findOne(filter); // Find existing user

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Determine the type of item
    const itemType = bookmarkDto.itemType as keyof typeof existingUser.item;

    if (existingUser.item[itemType]) {
      const itemIndex = existingUser.item[itemType].indexOf(bookmarkDto.itemId); // Find index of item
      if (itemIndex !== -1) {
        // If item exists in array, remove it
        existingUser.item[itemType].splice(itemIndex, 1);
        existingUser.markModified(`item.${itemType}`);
        await existingUser.save();
      }
    }
  }

  async getBookmarked(userId: string): Promise<bookmark[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    const bookmarks = await this.bookmarkModel.find({ userId }).exec();
    if (!bookmarks) {
      throw new NotFoundException('No bookmarks found for this user');
    }
    return bookmarks.map((bookmark) => ({
      userId: bookmark.userId,
      item: {
        exercise: bookmark.item.exercise || [],
        yoga: bookmark.item.yoga || [],
        diet: bookmark.item.diet || [],
        nutrition: bookmark.item.nutrition || [],
      },
    }));
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { bookmark } from './dto/bookmark.dto';
import { Bookmark } from './schema/bookmark.schema';
import mongoose from 'mongoose';
import { createOne } from 'src/factoryFunction';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: mongoose.Model<Bookmark>,
  ) {}

  async addBookmark(bookmarkDto: bookmark): Promise<void> {
    const filter = { userId: bookmarkDto.userId };
    try {
      const existingUser = await this.bookmarkModel.findOne(filter);
      if (existingUser) {
        const itemType = bookmarkDto.itemType as keyof typeof existingUser.item;

        const newItemId = bookmarkDto.itemId;
        let updateOperation;
        if (existingUser.item[itemType]) {
          updateOperation = { $addToSet: { [`item.${itemType}`]: newItemId } };
        } else {
          updateOperation = { $set: { [`item.${itemType}`]: [newItemId] } };
        }
        await this.bookmarkModel.updateOne(filter, updateOperation);
      } else {
        const newItem = await createOne(this.bookmarkModel, {
          userId: bookmarkDto.userId,
          item: {
            ...(bookmarkDto.itemType
              ? { [bookmarkDto.itemType]: [bookmarkDto.itemId] }
              : {}),
          },
        });
        await newItem.save();
      }
    } catch (error) {
      console.error('Error:', error);
      throw new BadRequestException('Error while bookmarking');
    }
  }

  async undoBookmark(bookmarkDto: bookmark): Promise<void> {
    const filter = { userId: bookmarkDto.userId };
    try {
      const existingUser = await this.bookmarkModel.findOne(filter);
      if (existingUser) {
        const itemType = bookmarkDto.itemType as keyof typeof existingUser.item;

        const { itemId } = bookmarkDto;

        if (existingUser.item[itemType]) {
          const itemIndex = existingUser.item[itemType].indexOf(itemId);
          if (itemIndex !== -1) {
            existingUser.item[itemType].splice(itemIndex, 1);
            existingUser.markModified(`item.${itemType}`);

            await existingUser.save();
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      throw new BadRequestException('Error while undoing bookmark');
    }
  }

  async getBookmarked(userId: string): Promise<bookmark[]> {
    try {
      const bookmarks = await this.bookmarkModel.find({ userId }).exec();
      const bookmarkObjects: bookmark[] = bookmarks.map((bookmark) => ({
        userId: bookmark.userId,
        item: {
          exercise: bookmark.item.exercise || [],
          yoga: bookmark.item.yoga || [],
          diet: bookmark.item.diet || [],
          nutrition: bookmark.item.nutrition || [],
        },
      }));
      return bookmarkObjects;
    } catch (error) {
      throw new Error('Error while getting bookmarks');
    }
  }
}

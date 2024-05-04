import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { bookmark } from './dto/bookmark.dto';
import { BookmarkService } from './bookmark.service';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('/addBookmark')
  async addBookmark(@Body() bookmarkDto: bookmark) {
    try {
      return await this.bookmarkService.addBookmark(bookmarkDto);
      // return 'Bookmarked successfully';
    } catch (error) {
      // Handle error appropriately
      console.error('Error adding bookmark:', error);
      return 'Failed to bookmark';
    }
  }

  @Post('/undoBookmark')
  async undoBookmark(@Body() bookmarkDto: bookmark) {
    try {
      console.log(bookmarkDto);
      await this.bookmarkService.undoBookmark(bookmarkDto);
      return 'Bookmark undone successfully';
    } catch (error) {
      // Handle error appropriately
      console.error('Error undoing bookmark:', error);
      return 'Failed to undo bookmark';
    }
  }
  @Get('/getBookmarked')
  async getBookmarked(@Query('userId') userId: string): Promise<bookmark[]> {
    return await this.bookmarkService.getBookmarked(userId);
  }
}

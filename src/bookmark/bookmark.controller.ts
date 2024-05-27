import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { bookmark } from './dto/bookmark.dto';
import { BookmarkService } from './bookmark.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('bookmark')
@UseGuards(AuthGuard)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('/addBookmark')
  async addBookmark(@Body() bookmarkDto: bookmark) {
    return await this.bookmarkService.addBookmark(bookmarkDto);
  }

  @Post('/undoBookmark')
  async undoBookmark(@Body() bookmarkDto: bookmark) {
    return await this.bookmarkService.undoBookmark(bookmarkDto);
  }
  @Get('/getBookmarked')
  async getBookmarked(@Query('userId') userId: string): Promise<bookmark[]> {
    return await this.bookmarkService.getBookmarked(userId);
  }
}

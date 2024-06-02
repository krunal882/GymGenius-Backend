import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'; // Import necessary decorators and utilities from '@nestjs/common'
import { bookmark } from './dto/bookmark.dto';
import { BookmarkService } from './bookmark.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('bookmark') // Define BookmarkController as a controller for '/bookmark' route
@UseGuards(AuthGuard) // Apply AuthGuard globally to all routes in BookmarkController
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {} // Inject BookmarkService into BookmarkController

  // POST endpoint for adding a bookmark
  @Post('/addBookmark')
  async addBookmark(@Body() bookmarkDto: bookmark) {
    return await this.bookmarkService.addBookmark(bookmarkDto);
  }

  // POST endpoint for undoing a bookmark
  @Post('/undoBookmark')
  async undoBookmark(@Body() bookmarkDto: bookmark) {
    return await this.bookmarkService.undoBookmark(bookmarkDto);
  }
  // GET endpoint for getting bookmarked items
  @Get('/getBookmarked')
  async getBookmarked(@Query('userId') userId: string): Promise<bookmark[]> {
    return await this.bookmarkService.getBookmarked(userId);
  }
}

// import { Body, Controller, Post } from '@nestjs/common';
// import { bookmark } from './dto/bookmark.dto';
// import { BookmarkService } from './bookmark.service';

// @Controller('bookmark')
// export class BookmarkController {
//   constructor(private readonly bookmarkService: BookmarkService) {}

//   @Post('/addBookmark')
//   async addBookmark(@Body() bookmarkDto: bookmark): Promise<string> {
//     try {
//       await this.bookmarkService.addBookmark(bookmarkDto);
//       return 'Bookmarked successfully';
//     } catch (error) {
//       // Handle error appropriately
//       console.error('Error adding bookmark:', error);
//       return 'Failed to bookmark';
//     }
//   }
// }

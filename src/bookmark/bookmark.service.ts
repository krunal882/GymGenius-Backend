// import { Injectable } from '@nestjs/common';
// import { bookmark } from './dto/bookmark.dto';
// import { Bookmark } from './schema/bookmark.schema';
// import mongoose from 'mongoose';
// import { createOne } from 'src/factoryFunction';
// import { InjectModel } from '@nestjs/mongoose';

// @Injectable()
// export class BookmarkService {
//   constructor(
//     @InjectModel(Bookmark.name) private bookmarkModel: mongoose.Model<Bookmark>,
//   ) {}

//   async addBookmark(bookmark: bookmark): Promise<string> {
//     await createOne(this.bookmarkModel, bookmark);
//     return 'The was bookmarked successfully';
//   }
// }

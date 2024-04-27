import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExercisesModule } from './exercises/exercises.module';
import { YogaModule } from './yoga/yoga.module';
import { DietPlanModule } from './diet-plan/diet-plan.module';
import { FoodNutritionModule } from './food-nutrition/food-nutrition.module';
import { ShopModule } from './shop/shop.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
// import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/FitFlex'),

    JwtModule.register({
      global: true,
      secret: 'okaysomthigngoorjofjdo',
      signOptions: { expiresIn: '15d' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ExercisesModule,
    YogaModule,
    DietPlanModule,
    FoodNutritionModule,
    ShopModule,
    AuthModule,
    MailerModule,
    // BookmarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

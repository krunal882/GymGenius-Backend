import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { YogaCategory } from 'src/utils/role.enum';

export class updateYogaPoseDto {
  @IsOptional()
  @IsNotEmpty({ message: 'please provide yoga-pose name' })
  @IsString({ message: ' yoga-pose name must be a string' })
  @IsEnum(YogaCategory, {
    message:
      'yoga category must be one of: Core Yoga, Seated Yoga, Strengthening Yoga, Chest Opening Yoga, Backbend Yoga ,Forward Bend Yoga, Hip Opening Yoga, Standing Yoga, Restorative Yoga, Arm Balance Yoga, Balancing Yoga, Inversion Yoga',
  })
  category_name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'please provide category description of yoga' })
  @IsString({ message: 'category description must be a string' })
  category_description: string;

  @IsOptional()
  @IsNotEmpty({ message: 'please provide english name of yoga' })
  @IsString({ message: 'english name must be a string' })
  english_name: string;

  @IsOptional()
  @IsString({ message: 'english name must be a string' })
  sanskrit_name_adapted: string;

  @IsOptional()
  @IsNotEmpty({ message: 'please provide sanskrit name of yoga' })
  @IsString({ message: 'sanskrit name must be a string' })
  sanskrit_name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'please provide translation of yga-pose name' })
  @IsString({ message: 'translation name must be a string' })
  translation_name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'please provide description of yoga' })
  @IsString({ message: 'pose description must be a string' })
  pose_description: string;

  @IsOptional()
  @IsNotEmpty({ message: 'please provide benefits of yoga' })
  @IsString({ message: 'pose benefits must be a string' })
  pose_benefits: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'please provide png photo or source link of the yoga pose',
  })
  @IsString({ message: 'url must be a string' })
  url_png: string;
}

// Import validation decorators
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class YogaPoseDto {
  @IsNotEmpty({ message: 'please provide yoga-pose name' })
  @IsString({ message: ' yoga-pose name must be a string' })
  category_name: string;

  @IsNotEmpty({ message: 'please provide category description of yoga' })
  @IsString({ message: 'category description must be a string' })
  category_description: string;

  @IsNotEmpty({ message: 'please provide english name of yoga' })
  @IsString({ message: 'english name must be a string' })
  english_name: string;

  @IsOptional() // optional field
  @IsString({ message: 'adapted sanskrit name must be a string' })
  sanskrit_name_adapted: string;

  @IsNotEmpty({ message: 'please provide sanskrit name of yoga' })
  @IsString({ message: 'sanskrit name must be a string' })
  sanskrit_name: string;

  @IsNotEmpty({ message: 'please provide translation of yga-pose name' })
  @IsString({ message: 'translation name must be a string' })
  translation_name: string;

  @IsNotEmpty({ message: 'please provide description of yoga' })
  @IsString({ message: 'pose description must be a string' })
  pose_description: string;

  @IsNotEmpty({ message: 'please provide benefits of yoga' })
  @IsString({ message: 'pose benefits must be a string' })
  pose_benefits: string;

  @IsNotEmpty({
    message: 'please provide png photo or source link of the yoga pose',
  })
  @IsString({ message: 'url must be a string' })
  url_png: string;
}

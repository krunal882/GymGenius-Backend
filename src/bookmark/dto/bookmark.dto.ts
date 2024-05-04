import { IsNotEmpty, IsString } from 'class-validator';

export class bookmark {
  @IsNotEmpty({ message: 'please provide userId' })
  @IsString({ message: 'user id must be a string' })
  userId: string;

  item: {
    exercise: string[];
    yoga: string[];
    diet: string[];
    nutrition: string[];
  };
  itemId?: string;
  itemType?: string;
}

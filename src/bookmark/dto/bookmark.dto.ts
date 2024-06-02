import { IsNotEmpty, IsString } from 'class-validator'; // Import necessary decorators from class-validator

export class bookmark {
  @IsNotEmpty({ message: 'please provide userId' })
  @IsString({ message: 'user id must be a string' })
  userId: string;

  item: {
    // Object containing different types of items
    exercise: string[];
    yoga: string[];
    diet: string[];
    nutrition: string[];
  };
  itemId?: string;
  itemType?: string;
}

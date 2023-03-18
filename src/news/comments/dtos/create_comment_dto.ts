import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCommentDto {
	@IsNotEmpty()
	@IsString()
	message: string;

	@IsNotEmpty()
	@IsNumber()
	userId: number;
}

import { IsString, IsNotEmpty, ValidateIf } from 'class-validator';

export class EditCommentDto {
	@IsString()
	@IsNotEmpty()
	@ValidateIf((o) => o.message)
	message: string;
}

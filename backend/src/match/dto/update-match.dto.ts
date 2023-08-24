import { PartialType } from '@nestjs/mapped-types'
import { CreateMatchDto } from './create-match.dto'
import { IsNotEmpty } from 'class-validator'

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
    @IsNotEmpty()
    id: number
}

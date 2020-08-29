import {ApiProperty} from "@nestjs/swagger";
import{IsAlpha, IsArray, IsAlphanumeric, IsDate, IsBoolean, IsDecimal,
IsEmail, isEmpty, isNumber, isPhoneNumber, isBase64, isDefined, isInstance, isInt,
ArrayContains, ArrayMaxSize, ArrayMinSize, ArrayUnique, ArrayNotContains,
IsOptional, IsString, Max, Min, MinLength, MaxDate, MaxLength, Allow, Equals, IsISO8601,
IsDivisibleBy,IsJSON, IsNotEmpty, IsNegative, IsAscii, IsEnum, IsIn, IsObject, IsUppercase} from "class-validator";
import {Type, Exclude, Expose} from 'class-transformer'

export const PropertyDecorator =() => {

}
import { IsString } from "class-validator";

export class AerolineaDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsDateString()
    @IsNotEmpty()
    readonly fechaFundacion: Date;

    @IsUrl()
    @IsNotEmpty()
    readonly paginaWeb: string;
}

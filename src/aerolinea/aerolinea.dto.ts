import { IsDate, IsDateString, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class AerolineaDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsDateString()
    @IsNotEmpty()
    fechaFundacion: Date;

    @IsUrl()
    @IsNotEmpty()
    readonly paginaWeb: string;
}

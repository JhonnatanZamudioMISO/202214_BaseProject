import { AerolineaEntity } from "../aerolinea/aerolinea.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AeropuertoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    codigo:number;

    @Column()
    pais:string;

    @Column()
    ciudad:string;

    @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
    aerolineas: AerolineaEntity[];
}

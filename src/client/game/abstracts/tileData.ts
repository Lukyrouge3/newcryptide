import { AnimalType, Biome, StructureColor, StructureType } from "../enums";

export type TileData = {
    biome: Biome;
    x: number;
    y: number;
    animal: AnimalType;
    structure_type: StructureType;
    structure_color: StructureColor;
}
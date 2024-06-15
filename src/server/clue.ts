import { assert } from "console";
import { TileData } from "../game/abstracts/tileData";
import { AnimalType, Biome, StructureColor, StructureType } from "../game/enums";

export abstract class Clue {
    public abstract filter(data: Map<number, TileData>): Map<number, TileData>;
    public toString(): string {
        return this.constructor.name;
    }
}

export class InBiomeAmongTwoClue extends Clue {
    private biome1: Biome;
    private biome2: Biome;

    constructor(biome1: Biome, biome2: Biome) {
        super();
        this.biome1 = biome1;
        this.biome2 = biome2;

        assert(biome1 != biome2, "biome1 and biome2 cannot be the same");
    }

    public filter(data: Map<number, TileData>): Map<number, TileData> {
        const result = new Map(data);
        for (const [key, tileData] of data) {
            if (tileData.biome != this.biome1 && tileData.biome != this.biome2) {
                result.delete(key);
            }
        }
        return result;
    }
}

export class InOrNextToBiomeOrAnimalClue extends Clue {
    private biome: Biome | null;
    private animal: AnimalType;
    private tiles: Map<number, TileData>;

    constructor(tiles: Map<number, TileData>, biome: Biome | null, animal: AnimalType) {
        super();
        this.tiles = tiles;
        this.biome = biome;
        this.animal = animal;

        assert(biome != null || animal != AnimalType.NONE, "biome and animal cannot both be null");
    }

    public filter(data: Map<number, TileData>): Map<number, TileData> {
        const result = new Map(data);
        if (this.biome != null) {
            for (const [key, _] of result) {
                if (this.tiles.get(key) == undefined) result.delete(key);
            }
        }
        if (this.animal != AnimalType.NONE) {
            for (const [key, _] of result) {
                if (this.tiles.get(key) == undefined) result.delete(key);
            }
        }
        return result;
    }
}

export class InOrWithin2OfAnimalOrStructureClue extends Clue {
    private animal: AnimalType;
    private structure: StructureType;
    private animalTiles: Map<number, TileData>;
    private structureTiles: Map<number, TileData>;

    constructor(animalTiles: Map<number, TileData>, structureTiles: Map<number, TileData>, animal: AnimalType, structure: StructureType) {
        super();
        this.animalTiles = animalTiles;
        this.structureTiles = structureTiles;
        this.animal = animal;
        this.structure = structure;

        assert(animal != AnimalType.NONE || structure != StructureType.NONE, "animal and structure cannot both be null");
    }

    public filter(data: Map<number, TileData>): Map<number, TileData> {
        const result = new Map(data);
        if (this.animal != AnimalType.NONE) {
            for (const [key, _] of result) {
                if (this.animalTiles.get(key) == undefined) result.delete(key);
            }
        }
        if (this.structure != StructureType.NONE) {
            for (const [key, _] of result) {
                if (this.structureTiles.get(key) == undefined) result.delete(key);
            }
        }
        return result;
    }
}

export class InOrWithin3OfStructureColorClue extends Clue {
    private color: StructureColor;
    private structureTiles: Map<number, TileData>;

    constructor(structureTiles: Map<number, TileData>, color: StructureColor) {
        super();
        this.structureTiles = structureTiles;
        this.color = color;
    }

    public filter(data: Map<number, TileData>): Map<number, TileData> {
        const result = new Map(data);
        for (const [key, _] of result) {
            if (this.structureTiles.get(key) == undefined) result.delete(key);
        }
        return result;
    }
}
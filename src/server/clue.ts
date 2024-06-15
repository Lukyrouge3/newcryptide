import { assert } from "console";
import { TileData } from "../game/abstracts/tileData";
import { AnimalType, Biome } from "../game/enums";

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
    private animalTiles: Map<number, TileData>;
    private biomeTiles: Map<number, TileData>;

    constructor(biomeTiles: Map<number, TileData>, animalTiles: Map<number, TileData>, biome: Biome | null, animal: AnimalType) {
        super();
        this.biomeTiles = biomeTiles;
        this.animalTiles = animalTiles;
        this.biome = biome;
        this.animal = animal;

        assert(biome != null || animal != AnimalType.NONE, "biome and animal cannot both be null");
    }

    public filter(data: Map<number, TileData>): Map<number, TileData> {
        const result = new Map(data);
        if (this.biome != null) {
            for (const [key, _] of result) {
                if (this.biomeTiles.get(key) == undefined) result.delete(key);
            }
        }
        if (this.animal != AnimalType.NONE) {
            for (const [key, _] of result) {
                if (this.animalTiles.get(key) == undefined) result.delete(key);
            }
        }
        return result;
    }
}
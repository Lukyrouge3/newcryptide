import { assert } from "console";
import { TileData } from "../client/game/abstracts/tileData";
import { AnimalType, Biome, StructureColor, StructureType } from "../client/game/enums";

export abstract class Clue {
    public abstract filter(data: Map<number, TileData>): Map<number, TileData>;
    public toString(): string {
        return this.constructor.name;
    }
}

export const BiomeNames = new Map<Biome, string>([
	[Biome.FOREST, "forest"],
	[Biome.DESERT, "desert"],
	[Biome.MOUNTAIN, "mountain"],
	[Biome.WATER, "water"],
	[Biome.SWAMP, "swamp"]
]);

export const AnimalNames = new Map<AnimalType, string>([
	[AnimalType.PUMA, "puma"],
	[AnimalType.BEAR, "bear"]
]);

export const StructureNames = new Map<StructureType, string>([
	[StructureType.STONE, "stone"],
	[StructureType.CABIN, "cabin"]
]);

export const StructureColorNames = new Map<StructureColor, string>([
	[StructureColor.BLACK, "black"],
	[StructureColor.WHITE, "white"],
	[StructureColor.GREEN, "green"],
	[StructureColor.BLUE, "blue"]
]);

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

	public toString(): string {
		return `In ${BiomeNames.get(this.biome1)} or ${BiomeNames.get(this.biome2)}`;
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

	public toString(): string {
		if (this.biome != null) {
			return `In or next to ${BiomeNames.get(this.biome)}`;
		}
		return `In or next to ${AnimalNames.get(this.animal)}`;
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

	public toString(): string {
		if (this.animal != AnimalType.NONE) {
			return `In or within 2 of ${AnimalNames.get(this.animal)}`;
		}
		return `In or within 2 of ${StructureNames.get(this.structure)}`;
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

	public toString(): string {
		return `In or within 3 of ${StructureColorNames.get(this.color)} structure`;
	}
}
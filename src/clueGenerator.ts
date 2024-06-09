import assert from 'assert';
import { Biome } from './game/gameTile';
import { Block, generateMap, shuffleArray } from './game/tileGroup';
import Rand from 'rand-seed';

export enum StructureType {
    STONE,
    CABIN,
    NONE
}

export enum StructureColor {
    BLACK,
    WHITE
}

export enum AnimalType {
    PUMA,
    BEAR,
    NONE
}

export type TileData = {
    biome: Biome;
    x: number;
    y: number;
    animal: AnimalType;
    structure_type: StructureType;
    structure_color: StructureColor;
}

abstract class Clue {
    public abstract filter(data: TileData[]): TileData[];
    // public abstract toString(): string;

    private static oddq_direction_differences = [
        // even cols 
        [[+1, 0], [+1, -1], [0, -1],
        [-1, -1], [-1, 0], [0, +1]],
        // odd cols 
        [[+1, +1], [+1, 0], [0, -1],
        [-1, 0], [-1, +1], [0, +1]],
    ]

    private static oddq_offset_neighbor(hex: { col: number, row: number }, direction: number) {
        var parity = hex.col & 1
        var diff = Clue.oddq_direction_differences[parity][direction]
        return [hex.col + diff[0], hex.row + diff[1]]
    }

    public static getNeighbors(data: TileData[], tile: TileData, distance: number): TileData[] {
        const neighbors: TileData[] = [];
        const toVisit: TileData[] = [tile];

        while (toVisit.length > 0) {
            const current = toVisit.shift();
            if (current) neighbors.push(current);
            else continue;

            for (let i = 0; i < 6; i++) {
                const hex = { col: current.x, row: current.y };
                const neighbor_pos = Clue.oddq_offset_neighbor(hex, i);
                const neighbor = data.find(tile => tile.x === neighbor_pos[0] && tile.y === neighbor_pos[1]);
                if (neighbor && distance > 0) toVisit.push(neighbor);
            }
            distance--;
        }

        return neighbors;
    }
}

class InTerrainAmongTwoClue extends Clue {
    private biomes: Biome[];

    constructor(biome1: Biome, biome2: Biome) {
        super();
        this.biomes = [biome1, biome2];
        assert(biome1 !== biome2, "Biomes must be different");
    }

    public filter(data: TileData[]): TileData[] {
        return data.filter(tile => this.biomes.includes(tile.biome));
    }
}


class InOrNextToBiomeOrTerritoryClue extends Clue {
    private biome: Biome | null;
    private animal: AnimalType;

    constructor(biome: Biome | null, animal: AnimalType = AnimalType.NONE) {
        super();
        this.biome = biome;
        this.animal = animal;
        assert(this.biome !== null || this.animal != AnimalType.NONE, "Clue must have at least one condition");
    }

    public filter(data: TileData[]): TileData[] {
        const res: TileData[] = [];
        for (const tile of data) {
            const neighbors = Clue.getNeighbors(data, tile, 1);
            if (this.biome != null && neighbors.filter(neighbor => neighbor.biome === this.biome).length > 0)
            {
                if (res.filter(t => t.x === tile.x && t.y === tile.y).length == 0) res.push(tile);
            }
            else if (this.animal != AnimalType.NONE && neighbors.filter(neighbor => neighbor.animal === this.animal).length > 0)
                if (res.filter(t => t.x === tile.x && t.y === tile.y).length == 0) res.push(tile);
        }
        return res;
    }
}

class InOrWithin2OfTerritoryOrStructureClue extends Clue {
    private animal: AnimalType;
    private structure_type: StructureType;

    constructor(animal: AnimalType, structure_type: StructureType) {
        super();
        this.animal = animal;
        this.structure_type = structure_type;
        assert(this.animal !== AnimalType.NONE || this.structure_type !== StructureType.NONE, "Clue must have at least one condition");
    }

    public filter(data: TileData[]): TileData[] {
        const res: TileData[] = [];
        for (const tile of data) {
            const neighbors = Clue.getNeighbors(data, tile, 2);
            if (this.animal != AnimalType.NONE && neighbors.filter(neighbor => neighbor.animal === this.animal).length > 0) {
                if (res.filter(t => t.x === tile.x && t.y === tile.y).length === 0) res.push(tile);
            }
            else if (this.structure_type != StructureType.NONE && neighbors.filter(neighbor => neighbor.structure_type === this.structure_type).length > 0)
                if (res.filter(t => t.x === tile.x && t.y === tile.y).length === 0) res.push(tile);
        }
        return res;
    }
}

class InOrWithin3OfStructureColorClue extends Clue {
    private structure_color: StructureColor;

    constructor(structure_color: StructureColor) {
        super();
        this.structure_color = structure_color;
    }

    public filter(data: TileData[]): TileData[] {
        const res: TileData[] = [];
        for (const tile of data) {
            const neighbors = Clue.getNeighbors(data, tile, 3);
            if (neighbors.filter(neighbor => neighbor.structure_color === this.structure_color && neighbor.structure_type != StructureType.NONE).length > 0)
                if (res.filter(t => t.x === tile.x && t.y === tile.y).length === 0) res.push(tile);
        }
        return res;
    }
}

function generateAllClues(data: TileData[], x: number, y: number) {
    const clues: Clue[] = [];
    const biomes = [Biome.FOREST, Biome.DESERT, Biome.MOUNTAIN, Biome.WATER, Biome.SWAMP];
    const animals = [AnimalType.BEAR, AnimalType.PUMA, AnimalType.NONE];
    const structure_types = [StructureType.CABIN, StructureType.STONE, StructureType.NONE];
    const structure_colors = [StructureColor.BLACK, StructureColor.WHITE];

    // console.log(data.find(tile => tile.x === x && tile.y === y));
    // console.log(Clue.getNeighbors(data, data.find(tile => tile.x === x && tile.y === y)!, 1).length);

    for (let i = 0; i < biomes.length; i++) {
        for (let j = i; j < biomes.length; j++) {
            const biome1 = biomes[i];
            const biome2 = biomes[j];
            if (biome1 === biome2) continue;
            const c = new InTerrainAmongTwoClue(biome1, biome2);
            if (c.filter(data).find(tile => tile.x === x && tile.y === y))
                clues.push(c);
        }
    }

    for (const biome of biomes) {
        const c = new InOrNextToBiomeOrTerritoryClue(biome, AnimalType.NONE);
        if (c.filter(data).find(tile => tile.x === x && tile.y === y))
            clues.push(c);
    }

    for (const animal of animals) {
        if (animal === AnimalType.NONE) continue;
        const c = new InOrNextToBiomeOrTerritoryClue(null, animal);
        if (c.filter(data).find(tile => tile.x === x && tile.y === y))
            clues.push(c);
    }

    for (const animal of animals) {
        for (const structure_type of structure_types) {
            if (animal === AnimalType.NONE && structure_type === StructureType.NONE) continue;
            const c = new InOrWithin2OfTerritoryOrStructureClue(animal, structure_type);
            if (c.filter(data).find(tile => tile.x === x && tile.y === y))
                clues.push(c);
        }
    }

    for (const structure_color of structure_colors) {
        const c = new InOrWithin3OfStructureColorClue(structure_color);
        if (c.filter(data).find(tile => tile.x === x && tile.y === y))
            clues.push(c);
    }

    return clues;
}

function generateData(seed: string = "cryptide") {
    const data: TileData[] = [];
    const sblocks = [...blocks];
    shuffleArray(sblocks, seed);

    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 6; j++) {
            const block_i = Math.floor(i / 6) + Math.floor(j / 3) * 2;
            const td = sblocks[block_i][(i % 6) + (j % 3) * 6];
            td.x = i;
            td.y = j;
            data.push(td);
        }
    }

    const rand = new Rand(seed == "" ? undefined : seed);
    let i = Math.floor(rand.next() * data.length);
    data[i].structure_type = StructureType.STONE;
    data[i].structure_color = StructureColor.BLACK;
    i = Math.floor(rand.next() * data.length);
    data[i].structure_type = StructureType.STONE;
    data[i].structure_color = StructureColor.WHITE;
    i = Math.floor(rand.next() * data.length);
    data[i].structure_type = StructureType.CABIN;
    data[i].structure_color = StructureColor.BLACK;
    i = Math.floor(rand.next() * data.length);
    data[i].structure_type = StructureType.CABIN;
    data[i].structure_color = StructureColor.WHITE;

    return data;
}

function generateCluesCombination(clues: Clue[], data: TileData[], n: number): Clue[][] {
    if (n == 0) return [];
    if (n == 1) return clues.map(clue => [clue]);
    const res: Clue[][] = [];

    for (let i = 0; i < clues.length; i++) {
        const remaining_clues = generateCluesCombination(clues.slice(i + 1), data, n - 1);

        for (const c of remaining_clues) {
            res.push([clues[i], ...c]);
        }
    }

    return res;
}

function getPerfectClueSets(clues_combination: Clue[][], data: TileData[], x: number, y: number) {
    const perfect_clue_sets: Clue[][] = [];
    for (const clues of clues_combination) {
        let tmp = data;
        for (const clue of clues) {
            tmp = clue.filter(tmp);
        }
        if (tmp.find(tile => tile.x === x && tile.y === y)) {
            console.log(tmp.length);
            perfect_clue_sets.push(clues);
        }
    }
    return perfect_clue_sets;
}

// const clues_length: number[] = [];
// for (let i = 0; i < 12; i++) {
//     for (let j = 0; j < 6; j++) {
//         const clues = generateAllClues(generateData(), i, j);
//         clues_length.push(clues.length);
//     }
// }
// console.log(clues_length, clues_length.reduce((a, b) => a + b, 0) / clues_length.length, Math.min(...clues_length), Math.max(...clues_length));


const blocks: TileData[][] = [
    [
        { biome: Biome.WATER, x: 0, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 1, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 2, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.FOREST, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 3, y: 2, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 4, y: 2, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ],
    [
        { biome: Biome.SWAMP, x: 0, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 1, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 2, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.DESERT, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 5, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 3, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 4, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ],
    [
        { biome: Biome.SWAMP, x: 0, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 2, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 1, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 1, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.WATER, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 5, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 0, y: 2, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 3, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 4, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ],
    [
        { biome: Biome.DESERT, x: 0, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 2, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 0, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.WATER, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 5, y: 1, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 0, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 3, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 4, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ],
    [
        { biome: Biome.SWAMP, x: 0, y: 0, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 0, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 2, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 1, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.MOUNTAIN, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 5, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 0, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 3, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 4, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ],
    [
        { biome: Biome.DESERT, x: 0, y: 0, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 2, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 0, y: 1, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 1, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.FOREST, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 0, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 3, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 4, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ]
]

for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 6; j++) {
        const clues = generateAllClues(generateData(), i, j);
        const clues_combination = generateCluesCombination(clues, generateData(), 3);
        // console.log(clues_combination.length);
        const perfect_clue_sets = getPerfectClueSets(clues_combination, generateData(), i, j);
        // if (perfect_clue_sets.length > 0)
        //     console.log("FOUND", perfect_clue_sets.length, perfect_clue_sets);
        console.log(i, j, clues.length, clues_combination.length, perfect_clue_sets.length);
        break;
    }
    break;
}

// let data = generateData();
// const clue1 = new InOrNextToBiomeOrTerritoryClue(null, AnimalType.PUMA);
// const clue2 = new InOrNextToBiomeOrTerritoryClue(null, AnimalType.BEAR);
// console.log(data.length);
// data = clue1.filter(data);
// console.log(data.length);
// data = clue2.filter(data);
// console.log(data.length);

//TODO: Implement clues' reverse
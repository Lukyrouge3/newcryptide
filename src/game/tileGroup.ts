import p5 from "p5";
import Tile from "./abstracts/tile";
import { Biome } from "./gameTile";
import Rand, {PRNG} from 'rand-seed';

export type Block = {
    biomes: Biome[][],
    id: number,
    bears: number[][],
    puma: number[],
    structures: number[]
}

export type Structure = {
    id: number,
    color: number,
    type: number
}

export const blocks: Block[] = [
    {
        biomes: [
        [
            Biome.WATER,
            Biome.WATER,
            Biome.WATER,
            Biome.WATER,
            Biome.FOREST,
            Biome.FOREST,
        ],
        [
            Biome.SWAMP,
            Biome.SWAMP,
            Biome.WATER,
            Biome.DESERT,
            Biome.FOREST,
            Biome.FOREST,
        ],
        [
            Biome.SWAMP,
            Biome.SWAMP,
            Biome.DESERT,
            Biome.DESERT,
            Biome.DESERT,
            Biome.FOREST,
        ]
        ],
        id: 1,
        bears: [[3, 2], [4,2]],
        puma: [],
        structures: [],
    },
    {
        biomes:     [
            [
                Biome.DESERT,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN,
                Biome.SWAMP
            ],
            [
                Biome.DESERT,
                Biome.DESERT,
                Biome.DESERT,
                Biome.FOREST,
                Biome.SWAMP,
                Biome.SWAMP
            ],
            [
                Biome.FOREST,
                Biome.FOREST,
                Biome.FOREST,
                Biome.FOREST,
                Biome.FOREST,
                Biome.SWAMP
            ]
        ],
        id: 1,
        bears: [],
        puma: [],
        structures: [],
    },
    {
        biomes: [
            [
                Biome.SWAMP,
                Biome.SWAMP,
                Biome.FOREST,
                Biome.FOREST,
                Biome.FOREST,
                Biome.WATER
            ],
            [
                Biome.SWAMP,
                Biome.SWAMP,
                Biome.FOREST,
                Biome.MOUNTAIN,
                Biome.WATER,
                Biome.WATER
            ],
            [
                Biome.MOUNTAIN,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN,
                Biome.WATER,
                Biome.WATER
            ]
        ],
        id: 0,
        bears: [],
        puma: [],
        structures: [],
    },
    {
        biomes: [
            [
                Biome.DESERT,
                Biome.DESERT,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN
            ],
            [
                Biome.DESERT,
                Biome.DESERT,
                Biome.MOUNTAIN,
                Biome.WATER,
                Biome.WATER,
                Biome.WATER
            ],
            [
                Biome.DESERT,
                Biome.DESERT,
                Biome.DESERT,
                Biome.FOREST,
                Biome.FOREST,
                Biome.FOREST
            ]
        ],
        id: 0,
        bears: [],
        puma: [],
        structures: [],
    },
    {
        biomes: [
            [
                Biome.SWAMP,
                Biome.SWAMP,
                Biome.SWAMP,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN
            ],
            [
                Biome.SWAMP,
                Biome.DESERT,
                Biome.DESERT,
                Biome.WATER,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN
            ],
            [
                Biome.DESERT,
                Biome.DESERT,
                Biome.WATER,
                Biome.WATER,
                Biome.WATER,
                Biome.WATER
            ]
        ],
        id: 0,
        bears: [],
        puma: [],
        structures: [],
    },
    {
        biomes: [
            [
                Biome.FOREST,
                Biome.WATER,
                Biome.WATER,
                Biome.WATER,
                Biome.WATER,
                Biome.MOUNTAIN
            ],
            [
                Biome.FOREST,
                Biome.FOREST,
                Biome.SWAMP,
                Biome.SWAMP,
                Biome.MOUNTAIN,
                Biome.MOUNTAIN
            ],
            [
                Biome.FOREST,
                Biome.SWAMP,
                Biome.SWAMP,
                Biome.SWAMP,
                Biome.DESERT,
                Biome.DESERT
            ]
        ],
        id: 0,
        bears: [],
        puma: [],
        structures: [],
    },
]

export function shuffleArray(array: any[], seed: string) {
    const rand = new Rand(seed == "" ? undefined : seed);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rand.next() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function generateMap(width: number, height: number, seed: string) {
    const shuffledBlocks = [...blocks];
    shuffleArray(shuffledBlocks, seed);
    const map: Biome[][] = [];
    for (let i = 0; i < width; i++) {
        map.push([]);
        for (let j = 0; j < height; j++) {
            const block_i = Math.floor(i / 6) + Math.floor(j / 3) * 2;
            map[i].push(shuffledBlocks[block_i].biomes[j % 3][i % 6]);
        }
    }
    return map;
}

// export default class TileGroup {
//     public tiles: GameTile[] = [];

//     constructor(p: p5, x: number, y: number, width: number, height: number, seed: string = "") {
//         const map = generateMap(width, height, seed);
//         for (let i = 0; i < width; i++) {
//             for (let j = 0; j < height; j++) {
//                 const nx = x + i * Tile.width * 1.5 - 1;
//                 const ny = y + j * Tile.width * (p.sqrt(3) / 2) * 2 + (i % 2) * Tile.width * p.sqrt(3) / 2;

//                 const block_i = Math.floor(i / 6) + Math.floor(j / 3) * 2;
//                 const block = map[i][j];

//                 this.tiles.push(new GameTile(p, nx, ny, i, j, block));
//             }
//         }
//     }
// }
import p5 from "p5";
import Tile from "./abstracts/tile";
import GameTile, { Biome } from "./gameTile";
import Rand, {PRNG} from 'rand-seed';
import { Clue, TileData, blocks } from "../clueGenerator";

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
    const map: TileData[][] = [];
    for (let i = 0; i < width; i++) {
        map.push([]);
        for (let j = 0; j < height; j++) {
            const block_i = Math.floor(i / 6) + Math.floor(j / 3) * 2;
            map[i].push(shuffledBlocks[block_i][(i % 6) + (j % 3) * 6]);
        }
    }
    console.log(map);
    return map;
}

export default class TileGroup {
    public tiles: GameTile[] = [];
    private data: TileData[];
    private static instance: TileGroup;

    constructor(p: p5, x: number, y: number, width: number, height: number, data: TileData[], seed: string = "") {
        this.data = data;
        if (!TileGroup.instance) {
            TileGroup.instance = this;
        }
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const nx = x + i * Tile.width * 1.5 - 1;
                const ny = y + j * Tile.width * (p.sqrt(3) / 2) * 2 + (i % 2) * Tile.width * p.sqrt(3) / 2;

                const block = this.data.find(d => d.x == i && d.y == j)!;
                if (!block) throw new Error(`No block found at ${i}, ${j}`);

                this.tiles.push(new GameTile(p, nx, ny, block));
            }
        }
    }

    public highlightNeighbors(x: number, y: number, n: number) {
        const neighbors = Clue.getNeighbors(this.data, this.data.find(t => t.x == x && t.y == y)!, n);
        for (let neighbor of neighbors) {
            const tile = this.tiles.find(t => t.data.x == neighbor.x && t.data.y == neighbor.y);
            if (tile) {
                tile.onMouseEnter();
            }
        }
    }

    public highlightTiles(tiles: TileData[]) {
        for (let tile of tiles) {
            const t = this.tiles.find(t => t.data.x == tile.x && t.data.y == tile.y);
            if (t) {
                t.highlight();
            }
        }
    }

    public static getInstance(): TileGroup {
        if (!TileGroup.instance) {
            throw new Error("TileGroup not initialized");
        }
        return TileGroup.instance;
    }
}
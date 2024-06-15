import p5 from "p5";
import Tile from "./abstracts/tile";
import { TileData } from "./abstracts/tileData";
import GameTile from "./gameTile";

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
                const maxHeight = (p.height - 2 * x) / height;
                const maxWidth = (p.width - 2 * y) / width;
                let w = maxWidth;

                if (maxHeight / Math.sqrt(3) < maxWidth) {
                    w = maxHeight / Math.sqrt(3);
                }

                const nx = x + i * w * 1.5 - 1;
                const ny = y + j * w * (p.sqrt(3) / 2) * 2 + (i % 2) * w * p.sqrt(3) / 2;
                const block = this.data.find(d => d.x == i && d.y == j)!;
                if (!block) throw new Error(`No block found at ${i}, ${j}`);

                this.tiles.push(new GameTile(p, nx, ny, block, w));
            }
        }
    }

    // public highlightNeighbors(x: number, y: number, n: number) {
    //     const neighbors = Clue.getNeighbors(this.data, this.data.find(t => t.x == x && t.y == y)!, n);
    //     for (let neighbor of neighbors) {
    //         const tile = this.tiles.find(t => t.data.x == neighbor.x && t.data.y == neighbor.y);
    //         if (tile) {
    //             tile.onMouseEnter();
    //         }
    //     }
    // }

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
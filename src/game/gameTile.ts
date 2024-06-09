import p5, { Vector } from "p5";
import Tile from "./abstracts/tile";

export enum Biome {
    FOREST,
    DESERT,
    MOUNTAIN,
    WATER,
    SWAMP
}

export const biomeColors = (p: p5) => {
    return {
        [Biome.FOREST]: p.color(50, 200, 50),
        [Biome.DESERT]: p.color(255, 255, 100),
        [Biome.MOUNTAIN]: p.color(200, 200, 200),
        [Biome.WATER]: p.color(50, 50, 255),
        [Biome.SWAMP]: p.color(100, 50, 150)
    }
};

// export default class GameTile extends Tile {
//     public biome: Biome;
//     private col: number;
//     private row: number;

//     constructor(p: p5, x: number, y: number, col: number, row: number, biome: Biome = Biome.FOREST) {
//         const color = biomeColors(p)[biome];
//         super(p, x, y, color);
//         this.col = col;
//         this.row = row;
//         this.biome = biome;
//     }

//     private drawCoords() {
//         this.p.push();
//         this.p.translate(this.pos.x, this.pos.y);
//         this.p.stroke(0);
//         this.p.strokeWeight(1);
//         this.p.noFill();
//         const width = this.p.textWidth(`${this.col}, ${this.row}`);
//         this.p.text(`${this.col}, ${this.row}`, -width / 2, this.p.textAscent() / 2);
//         this.p.pop();
//     }

//     public draw() {
//         super.draw();
//         this.drawCoords();
//     }
// }
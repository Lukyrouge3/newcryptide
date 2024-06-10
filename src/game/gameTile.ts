import p5, { Vector } from "p5";
import Tile from "./abstracts/tile";
import { AnimalType, StructureType } from "./enums";
import { TileData } from "../clueGenerator";
import TileGroup from "./tileGroup";

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

export default class GameTile extends Tile {
    public biome: Biome;
    private col: number;
    private row: number;
    public data: TileData;

    constructor(p: p5, x: number, y: number, data: TileData) {
        const color = biomeColors(p)[data.biome];
        super(p, x, y, color);
        this.col = data.x;
        this.row = data.y;
        this.biome = data.biome;
        this.data = data;
    }

    private drawCoords() {
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y);
        this.p.stroke(0);
        this.p.strokeWeight(1);
        this.p.noFill();
        const width = this.p.textWidth(`${this.col}, ${this.row}`);
        this.p.text(`${this.col}, ${this.row}`, -width / 2, this.p.textAscent() / 2);
        this.p.pop();
    }

    private drawAnimal() {
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y);
        this.p.stroke(0);
        this.p.strokeWeight(1);
        this.p.noFill();
        const width = this.p.textWidth(AnimalType[this.data.animal]);
        this.p.text(AnimalType[this.data.animal], -width / 2, this.p.textAscent() / 2 + 15);
        this.p.pop();
    }

    private drawStructure() {
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y);
        this.p.stroke(0);
        this.p.strokeWeight(1);
        this.p.noFill();
        const width = this.p.textWidth(StructureType[this.data.structure_type]);
        this.p.text(StructureType[this.data.structure_type], -width / 2, this.p.textAscent() / 2 + 30);
        this.p.pop();
    }

    public draw() {
        super.draw();
        this.drawCoords();
        if (this.data.animal != AnimalType.NONE) {
            this.drawAnimal();
        }
        if (this.data.structure_type != StructureType.NONE) {
            this.drawStructure();
        }
    }

    public onMousePressed(): void {
        super.onMousePressed();
        // const tileGrp = TileGroup.getInstance();
        // tileGrp.highlightNeighbors(this.col, this.row, 3);
    }
}
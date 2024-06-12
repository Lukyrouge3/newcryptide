import p5, { Vector } from "p5";
import Tile from "./abstracts/tile";
import { AnimalType, StructureColor, StructureType } from "./enums";
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
        [Biome.WATER]: p.color(50, 50, 200),
        [Biome.SWAMP]: p.color(100, 50, 150)
    }
};

export default class GameTile extends Tile {
    public biome: Biome;
    private col: number;
    private row: number;
    public data: TileData;
    public highlighted: boolean = false;

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
        if (this.data.structure_color == StructureColor.BLACK) this.p.stroke(0);
        if (this.data.structure_color == StructureColor.BLUE) this.p.stroke(0, 0, 255);
        if (this.data.structure_color == StructureColor.WHITE) this.p.stroke(255);
        if (this.data.structure_color == StructureColor.GREEN) this.p.stroke(0, 255, 0);
        this.p.strokeWeight(1);
        this.p.noFill();
        const width = this.p.textWidth(StructureType[this.data.structure_type]);
        this.p.text(StructureType[this.data.structure_type], -width / 2, this.p.textAscent() / 2 + 30);
        this.p.pop();
    }

    private drawHighlight() {
        if (this.highlighted) {
            this.p.push();
            this.p.translate(this.pos.x, this.pos.y);
            this.p.stroke(255, 0, 0);
            this.p.strokeWeight(4);
            this.p.noFill();
            this.p.beginShape();
            this.p.vertex(-Tile.width, 0);
            this.p.vertex(-1 / 2 * Tile.width, 1 / 2 * this.p.sqrt(3) * Tile.width);
            this.p.vertex(1 / 2 * Tile.width, 1 / 2 * this.p.sqrt(3) * Tile.width);
            this.p.vertex(Tile.width, 0);
            this.p.vertex(1 / 2 * Tile.width, -1 / 2 * this.p.sqrt(3) * Tile.width);
            this.p.vertex(-1 / 2 * Tile.width, -1 / 2 * this.p.sqrt(3) * Tile.width);
            this.p.endShape(this.p.CLOSE);
            this.p.pop();
        }
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
        this.drawHighlight();
    }

    public onMousePressed(): void {
        super.onMousePressed();
        // const tileGrp = TileGroup.getInstance();
        // tileGrp.highlightNeighbors(this.col, this.row, 3);
    }

    public highlight() {
        this.highlighted = true;
    }
}
import p5, { Vector } from "p5";
import Tile from "./abstracts/tile";
import { AnimalType, Biome, StructureColor, StructureType } from "./enums";
import { TileData } from "./abstracts/tileData";

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

    constructor(p: p5, x: number, y: number, data: TileData, width: number) {
        const color = biomeColors(p)[data.biome];
        super(p, x, y, color, width);
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
        this.p.noFill();
        if (this.data.animal == AnimalType.BEAR) {
            this.p.drawingContext.setLineDash([5, 5]);
            this.p.stroke(0);
        }
        if (this.data.animal == AnimalType.PUMA) this.p.stroke(255, 0, 0);
        this.p.strokeWeight(2);
        Tile.drawHex(this.p, this.width - 4);        
        this.p.pop();
    }

    private drawStructure() {
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y);
        if (this.data.structure_color == StructureColor.BLACK) this.p.fill(0, 0, 0);
        if (this.data.structure_color == StructureColor.BLUE) this.p.fill(50, 50, 255);
        if (this.data.structure_color == StructureColor.WHITE) this.p.fill(255, 255, 255);
        if (this.data.structure_color == StructureColor.GREEN) this.p.fill(75, 255, 66);
        this.p.stroke(0);
        this.p.strokeWeight(1);
        if (this.data.structure_type == StructureType.CABIN) Tile.drawTriangle(this.p, this.width / 1.5);
        if (this.data.structure_type == StructureType.STONE) Tile.drawCircle(this.p, this.width / 1.5);
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
            this.p.vertex(-this.width, 0);
            this.p.vertex(-1 / 2 * this.width, 1 / 2 * this.p.sqrt(3) * this.width);
            this.p.vertex(1 / 2 * this.width, 1 / 2 * this.p.sqrt(3) * this.width);
            this.p.vertex(this.width, 0);
            this.p.vertex(1 / 2 * this.width, -1 / 2 * this.p.sqrt(3) * this.width);
            this.p.vertex(-1 / 2 * this.width, -1 / 2 * this.p.sqrt(3) * this.width);
            this.p.endShape(this.p.CLOSE);
            this.p.pop();
        }
    }

    public draw() {
        super.draw();
        // this.drawCoords();
        if (this.data.animal != AnimalType.NONE) {
            this.drawAnimal();
        }
        if (this.data.structure_type != StructureType.NONE) {
            this.drawStructure();
        }
        // this.drawHighlight();
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
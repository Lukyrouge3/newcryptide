import p5 from "p5";
import Drawable from "./drawable";

export default abstract class Tile extends Drawable {
    public width: number;
    public color: p5.Color;

    constructor(p: p5, x: number, y: number, color: p5.Color, width: number) {
        super(p, x, y);
        this.color = color;
        this.width = width;
    }

    public static drawHex(p: p5, width: number) {
        p.beginShape();
        p.vertex(-width, 0);
        p.vertex(-1 / 2 * width, 1 / 2 * p.sqrt(3) * width);
        p.vertex(1 / 2 * width, 1 / 2 * p.sqrt(3) * width);
        p.vertex(width, 0);
        p.vertex(1 / 2 * width, -1 / 2 * p.sqrt(3) * width);
        p.vertex(-1 / 2 * width, -1 / 2 * p.sqrt(3) * width);
        p.endShape(p.CLOSE);
    }

    public static drawTriangle(p: p5, width: number) {
        p.beginShape();
        p.vertex(-width / 2, -width / 2);
        p.vertex(width / 2, -width / 2);
        p.vertex(0, width / 2);
        p.endShape(p.CLOSE);
    }

    public static drawCircle(p: p5, width: number) {
        p.ellipse(0, 0, width, width);
    }

    public draw() {
        this.p.fill(this.color);
        this.p.stroke(255);
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y);
        Tile.drawHex(this.p, this.width);
        this.p.pop();
    }

    public isInside(x: number, y: number): boolean {
        const pos = this.p.createVector(x - this.pos.x, y - this.pos.y);
        return this.isInsideHexagon(pos);
    }

    private isInsideTriangle(p: p5.Vector, a: p5.Vector, b: p5.Vector, c: p5.Vector): boolean {
        const v0 = p5.Vector.sub(c, a);
        const v1 = p5.Vector.sub(b, a);
        const v2 = p5.Vector.sub(p, a);

        const dot00 = p5.Vector.dot(v0, v0);
        const dot01 = p5.Vector.dot(v0, v1);
        const dot02 = p5.Vector.dot(v0, v2);
        const dot11 = p5.Vector.dot(v1, v1);
        const dot12 = p5.Vector.dot(v1, v2);

        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
        return (u >= 0) && (v >= 0) && (u + v <= 1);
    }

    private isInsideHexagon(p: p5.Vector): boolean {
        const A = this.p.createVector(-this.width, 0);
        const B = this.p.createVector(-1 / 2 * this.width, 1 / 2 * this.p.sqrt(3) * this.width);
        const C = this.p.createVector(1 / 2 * this.width, 1 / 2 * this.p.sqrt(3) * this.width);
        const D = this.p.createVector(this.width, 0);
        const E = this.p.createVector(1 / 2 * this.width, -1 / 2 * this.p.sqrt(3) * this.width);
        const F = this.p.createVector(-1 / 2 * this.width, -1 / 2 * this.p.sqrt(3) * this.width);
        const O = this.p.createVector(0, 0);

        if (this.isInsideTriangle(p, A, B, O)) return true;
        if (this.isInsideTriangle(p, B, C, O)) return true;
        if (this.isInsideTriangle(p, C, D, O)) return true;
        if (this.isInsideTriangle(p, D, E, O)) return true;
        if (this.isInsideTriangle(p, E, F, O)) return true;
        if (this.isInsideTriangle(p, F, A, O)) return true;
        return false;
    }

    public onMouseEnter(): void {
        // this.color.setAlpha(100);
        this.pos.y -= 5;
        this.z += 1;
    }

    public onMouseLeave(): void {
        // this.color.setAlpha(255);
        this.pos.y += 5;
        this.z -= 1;
    }
}
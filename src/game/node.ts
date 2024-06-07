import p5 from "p5";
import IO from "./io";
import Drawable from "./abstracts/drawable";

export default class Node extends Drawable {
    private width: number = 50;
    private height: number = 50;

    constructor(p: p5, x: number, y: number) {
        super(p, x, y);
        this.children.push(new IO(p, x + this.width / 2, y));
    }

    isInside(x: number, y: number): boolean {
        return x >= this.pos.x && x < this.pos.x + this.width && y > this.pos.y && y < this.pos.y + this.height;
    }

    draw(): void {
        this.p.fill(255);
        this.p.noStroke();
        this.p.rect(this.pos.x, this.pos.y, this.width, this.height);
    }
}
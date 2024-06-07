import p5 from "p5";
import Drawable from "./abstracts/drawable";

export default class IO extends Drawable {
    public mode: "input" | "output" = "input";
    private color: p5.Color = this.p.color(255, 0, 0);
    public z: number = 1;

    constructor(p: p5, x: number, y: number) {
        super(p, x, y);
    }

    draw(): void {
        this.p.strokeWeight(10);
        this.p.stroke(this.color);
        this.p.point(this.pos.x, this.pos.y);
    }

    public override isInside(x: number, y: number): boolean {
        return this.p.dist(x, y, this.pos.x, this.pos.y) < 10;
    }

    public override onMouseEnter(): void {
        console.log("Mouse enter");
        this.color = this.p.color(0, 255, 0);
    }

    public override onMouseLeave(): void {
        console.log("Mouse enter");
        this.color = this.p.color(255, 0, 0);
    }
}
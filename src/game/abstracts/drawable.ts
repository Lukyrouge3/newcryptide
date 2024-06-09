import p5 from "p5";

export default abstract class Drawable {
    public pos: p5.Vector;
    public z: number = 0;
    protected p: p5;
    public children: Drawable[] = [];
    public static drawables: Drawable[] = [];
    public invisible: boolean = false;

    abstract draw(): void;
    constructor(p: p5, x: number, y: number) {
        this.pos = p.createVector(x, y);
        this.p = p;
        Drawable.drawables.push(this);
    }

    public isInside(x: number, y: number): boolean {
        return false;
    }
    public onMouseEnter(): void {};
    public onMouseLeave(): void {};
    public onMousePressed(): void {};
    public onMouseReleased(): void {};
}
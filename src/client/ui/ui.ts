import p5 from "p5";

export abstract class UIElement {
    public abstract draw(): void;
    public static uiElements: UIElement[] = [];
    protected p: p5;
    protected x: number;
    protected y: number;

    constructor (p: p5, x: number, y: number) {
        this.p = p;
        this.x = x;
        this.y = y;
        UIElement.uiElements.push(this);
    }
}
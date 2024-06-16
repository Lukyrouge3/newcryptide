import p5 from "p5";
import Drawable from "./abstracts/drawable";
import GameTile from "./gameTile";

export default class HoverManager {
    private p: p5;
    private static instance: HoverManager;
    private hover: Drawable | null = null;

    constructor(p: p5) {
        this.p = p;
        if (!HoverManager.instance) {
            HoverManager.instance = this;
        }
    }

    public update(): void {
        let newHover: Drawable | null = null;
        for (let drawable of Drawable.drawables.sort((a, b) => b.z - a.z)) {
            if (drawable.isInside(this.p.mouseX, this.p.mouseY)) {
                newHover = drawable;
                break;
            }
        }
        if (newHover !== this.hover) {
            if (this.hover) {
                this.hover.onMouseLeave();
            }
            if (newHover) {
                newHover.onMouseEnter();
            }
            this.hover = newHover;
        }
    }

    public mousePressed(): void {
        if (this.hover)
            this.hover.onMousePressed();
    }

    public mouseReleased(): void {
        if (this.hover)
            this.hover.onMouseReleased(); // TODO: Figure out if this needs arguments
    }

    public static getInstance(): HoverManager {
        if (!HoverManager.instance) {
            throw new Error("DragManager not initialized");
        }
        return HoverManager.instance;
    }
}
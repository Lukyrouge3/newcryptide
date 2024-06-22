import p5 from "p5";
import { UIElement } from "./ui";
import { Game } from "../game/game";

export class PlayerList extends UIElement {

    constructor(p: p5, x: number, y: number) {
        super(p, x, y);
    }

    public draw() {
        let y = this.y;
        this.p.push();
        this.p.fill(255);
        this.p.stroke(0);
        this.p.rect(this.x, y, 200, this.p.height);
        this.p.textSize(16);
        for (let player of Game.getInstance().players) {
            this.p.fill(player.color);
            this.p.text(player.name, this.x + 10, y + 16);
            y += 16 * 1.5;
        }
        this.p.pop();
    }
}
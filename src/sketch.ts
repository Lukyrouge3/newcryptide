import p5 from 'p5';
import HoverManager from './game/hoverManager';
import Drawable from './game/abstracts/drawable';
import TileGroup from './game/tileGroup';
import { ClueGenerator } from './server/gameGenerator';

export let dragManager: HoverManager;
export let clueGenerator = new ClueGenerator("cryptide");
let tiles;
export const sketch = (p: p5) => {

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.setup = () => {
        dragManager = new HoverManager(p);
        p.createCanvas(p.windowWidth, p.windowHeight);

        tiles = new TileGroup(p, 100, 100, 12, 9, Array.from(clueGenerator.data.values()), "cryptide");
    };

    p.draw = () => {
        p.background(0);
        dragManager.update();
        for (let drawable of Drawable.drawables.filter(d => !d.invisible).sort((a, b) => a.z - b.z)) {
            drawable.draw(); // TODO: Check if it's in the right order
        }

        p.push();
        p.stroke(255);
        p.noFill();
        p.text("FPS: " + p.frameRate().toFixed(2), 10, 10);
        p.pop();
    };

    p.mousePressed = () => {
        dragManager.mousePressed();
    }

    p.mouseReleased = () => {
        dragManager.mouseReleased();
    }
};

new p5(sketch);
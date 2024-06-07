import p5 from 'p5';
import Node from './game/node';
import HoverManager from './game/hoverManager';
import Drawable from './game/abstracts/drawable';

export let node: Node;
export let dragManager: HoverManager;
export const sketch = (p: p5) => {

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.setup = () => {
        dragManager = new HoverManager(p);
        node = new Node(p, p.windowWidth / 2, p.windowHeight / 2);
        p.createCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = () => {
        dragManager.update();
        p.background(100);
        for (let drawable of Drawable.drawables.sort((a, b) => a.z - b.z)) {
            drawable.draw(); // TODO: Check if it's in the right order
        }
    };

    p.mousePressed = () => {
        dragManager.mousePressed();
    }

    p.mouseReleased = () => {
        dragManager.mouseReleased();
    }
};

new p5(sketch);
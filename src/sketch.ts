import p5 from 'p5';
import HoverManager from './game/hoverManager';
import Drawable from './game/abstracts/drawable';
import TileGroup from './game/tileGroup';
import { blocks, generateData } from './clueGenerator';

console.log(JSON.stringify(blocks));
export let dragManager: HoverManager;
export let tileData = generateData();
let tiles;
export const sketch = (p: p5) => {

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.setup = () => {
        dragManager = new HoverManager(p);
        p.createCanvas(p.windowWidth, p.windowHeight);

        tiles = new TileGroup(p, 100, 100, 12, 9, tileData, "cryptide");

        // tiles.highlightNeighbors(5, 1, 2);

        // for (let i = 0; i < 12; i++) {
        //     for (let j = 0; j < 6; j++) {
        //         const clues = generateAllClues(generateData(), i, j);
        //         const clues_combination = generateCluesCombination(clues, generateData(), 3);
        //         // console.log(clues_combination.length);
        //         const perfect_clue_sets = getPerfectClueSets(clues_combination, generateData(), i, j);
        //         if (perfect_clue_sets.length > 0)
        //             console.log("FOUND", perfect_clue_sets.length, perfect_clue_sets);
        //         console.log(i, j, clues.length, clues_combination.length, perfect_clue_sets.length);
        //         break;
        //     }
        //     break;
        // }
    };

    p.draw = () => {
        p.background(0);
        dragManager.update();
        for (let drawable of Drawable.drawables.filter(d => !d.invisible).sort((a, b) => a.z - b.z)) {
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
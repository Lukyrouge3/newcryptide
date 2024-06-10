import p5 from 'p5';
import HoverManager from './game/hoverManager';
import Drawable from './game/abstracts/drawable';
import TileGroup from './game/tileGroup';
import { InOrNextToBiomeOrTerritoryClue, InOrWithin2OfTerritoryOrStructureClue, InTerrainAmongTwoClue, generateAllClues, generateCluesCombination, generateData, getPerfectClueSets } from './clueGenerator';
import { AnimalType, StructureType } from './game/enums';
import { Biome } from './game/gameTile';

export let dragManager: HoverManager;
export const tileData = generateData();
let tiles;
export const sketch = (p: p5) => {

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.setup = () => {
        dragManager = new HoverManager(p);
        p.createCanvas(p.windowWidth, p.windowHeight);
        tiles = new TileGroup(p, 100, 100, 12, 9, tileData, "cryptide");
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 9; j++) {
                const clues = generateAllClues(generateData(), i, j);
                const clues_combination = generateCluesCombination(clues, generateData(), 5);
                // console.log(clues_combination.length);
                const perfect_clue_sets = getPerfectClueSets(clues_combination, generateData(), i, j);
                if (perfect_clue_sets.length > 0) {
                    console.log("FOUND", i, j, perfect_clue_sets.length, perfect_clue_sets);
                    return;
                }
                console.log(i, j, clues.length, clues_combination.length, perfect_clue_sets.length);
            }
        }

        // let data = generateData();
        // const clue1 = new InTerrainAmongTwoClue(Biome.MOUNTAIN, Biome.WATER);
        // const clue2 = new InOrNextToBiomeOrTerritoryClue(Biome.MOUNTAIN, AnimalType.NONE);
        // const clue3 = new InOrWithin2OfTerritoryOrStructureClue(AnimalType.NONE, StructureType.CABIN);
        // console.log(data.length);
        // data = clue1.filter(data);
        // console.log(data.length);
        // data = clue2.filter(data);
        // console.log(data.length);
        // data = clue3.filter(data);
        // console.log(data.length);
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
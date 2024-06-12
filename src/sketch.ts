import p5 from 'p5';
import HoverManager from './game/hoverManager';
import Drawable from './game/abstracts/drawable';
import TileGroup from './game/tileGroup';
import { Clue, InOrNextToBiomeOrTerritoryClue, InOrWithin2OfTerritoryOrStructureClue, InOrWithin3OfStructureColorClue, InTerrainAmongTwoClue, blocks, generateAllClues, generateCluesCombination, generateData, getPerfectClueSets } from './clueGenerator';
import { AnimalType, StructureColor, StructureType } from './game/enums';
import { Biome } from './game/gameTile';

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

        console.log(generateAllClues(tileData, 5, 1));

        const c1 = new InOrWithin3OfStructureColorClue(StructureColor.BLUE);
        const c1_data = c1.filter(tileData);

        const c2 = new InOrWithin2OfTerritoryOrStructureClue(AnimalType.NONE, StructureType.CABIN);
        const c2_data = c2.filter(tileData);

        const c3 = new InOrNextToBiomeOrTerritoryClue(null, AnimalType.PUMA);
        const c3_data = c3.filter(tileData);

        const c4 = new InTerrainAmongTwoClue(Biome.DESERT, Biome.MOUNTAIN);
        const c4_data = c4.filter(tileData);
        
        const merged = c1_data.filter(x => c2_data.includes(x)).filter(x => c3_data.includes(x)).filter(x => c4_data.includes(x));

        tiles.highlightTiles(merged);


        // const i = 5, j = 1;
        // const clues = generateAllClues(tileData, i, j);
        // console.log(clues.length);
        // const clues_combination = generateCluesCombination(clues, tileData, 3);
        // console.log(clues_combination.length);
        // const perfect_clue_sets = getPerfectClueSets(clues_combination, tileData, i, j);
        // console.log(perfect_clue_sets);

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
import { Biome } from "../game/enums";
import { ClueGenerator } from "./gameGenerator";

const clueGenerator = new ClueGenerator("cryptide2");

console.time("Generate clues");
for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 6; j++) {
        const clues = clueGenerator.getPerfectClueSets(i, j, 5);
        if (clues.length > 0)
            console.log("FOUND", i, j, clues.length);
    }
}
console.timeEnd("Generate clues");

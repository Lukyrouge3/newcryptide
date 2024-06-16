import { TileData } from "../client/game/abstracts/tileData";
import { AnimalType, Biome, StructureColor, StructureType } from "../client/game/enums";

const blocks: TileData[][] = [
    [
        { biome: Biome.WATER, x: 0, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 1, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 2, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.FOREST, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 3, y: 2, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 4, y: 2, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ],
    [
        { biome: Biome.SWAMP, x: 0, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 1, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 2, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.DESERT, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 5, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 3, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 4, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ],
    [
        { biome: Biome.SWAMP, x: 0, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 2, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 1, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 1, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.WATER, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 5, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 0, y: 2, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 3, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 4, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ],
    [
        { biome: Biome.DESERT, x: 0, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 2, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 0, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.WATER, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 5, y: 1, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 0, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 3, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 4, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ],
    [
        { biome: Biome.SWAMP, x: 0, y: 0, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 1, y: 0, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 2, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 0, y: 1, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.MOUNTAIN, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 5, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 0, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 3, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 4, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ],
    [
        { biome: Biome.DESERT, x: 0, y: 0, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.DESERT, x: 1, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 2, y: 0, animal: AnimalType.PUMA, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 3, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 4, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 0, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 0, y: 1, animal: AnimalType.BEAR, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 1, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 2, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.SWAMP, x: 3, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.WHITE },
        { biome: Biome.FOREST, x: 4, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 1, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.MOUNTAIN, x: 0, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 1, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 2, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 3, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.WATER, x: 4, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
        { biome: Biome.FOREST, x: 5, y: 2, animal: AnimalType.NONE, structure_type: StructureType.NONE, structure_color: StructureColor.BLACK },
    ]
]

export default blocks;
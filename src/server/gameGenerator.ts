import Rand from "rand-seed";
import { TileData } from "../game/abstracts/tileData";
import blocks from "./original_blocks";
import { AnimalType, Biome, StructureColor, StructureType } from "../game/enums";

export function shuffleArray(array: any[], seed: string) {
    const rand = new Rand(seed == "" ? undefined : seed);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rand.next() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class ClueGenerator {
	private seed: string;
	private data: Map<number, TileData> = new Map();
	// For each range, we store the tiles that are within that range of each animal type
	private animalTiles: Map<number, TileData>[][] = []; // [range][AnimalType][]
	// For each range, we store the tiles that are within that range of each structure type
	private structureTypeTiles: Map<number, TileData>[][] = []; // [range][StructureType][]
	// For each range, we store the tiles that are within that range of each structure color
	private structureColorTiles: Map<number, TileData>[][] = []; // [range][StructureType][]
	private biomeTiles: Map<number, TileData>[][] = [];

	// For more speed we replaced the TileData[][][] with a Map<number, TileData>[][] with the key being something like "x + y * width"
	// So we also replaced animalTiles[range][AnimalType].find(t => t.x === x && t.y === y) with animalTiles[range][AnimalType].get(x + y * 9)
	// This should be faster because the find function is O(n) while the get function is usually O(1)

	constructor(seed = "cryptide") {
		this.seed = seed;
		this.data = this.generateData();
	}

	private generateData(): Map<number, TileData> {
		const data: Map<number, TileData> = new Map();
		const sblocks = [...blocks];
		shuffleArray(sblocks, this.seed); // TODO: Handle block rotation

		for (let i = 0; i < 12; i++) {
			for (let j = 0; j < 9; j++) {
				const block_i = Math.floor(i / 6) + Math.floor(j / 3) * 2;
				const td = sblocks[block_i][(i % 6) + (j % 3) * 6];
				td.x = i;
				td.y = j;
				data.set(i + j * 12, td);
			}
		}

		const rand = new Rand(this.seed);
		for (let typei in StructureType) {
			for (let colori in StructureColor) {
				const type = parseInt(typei);
				const color = parseInt(colori);
				const i = Math.floor(rand.next() * data.size);
				data[i].structure_type = type;
				data[i].structure_color = color;
			}
		}

		this.generateAnimalTiles();
		this.generateStructureTiles();
		this.generateBiomeTiles();
		return data;
	}

	private generateAnimalTiles() {
		for (let i = 1; i < 2; i++) {
			this.animalTiles.push([]);
			for (let _ in AnimalType) {
				this.animalTiles[i].push(new Map());
			}
			for (let [_key, tile] of this.data) {
				for (let animalTypei in AnimalType) {
					const animalType = parseInt(animalTypei);
					if (tile.animal == animalType) {
						const neighbors = this.getNeighbors(tile, i);
						for (let [_key2, neighbor] of neighbors) {
							this.animalTiles[i][animalType].set(neighbor.x + neighbor.y * 12, neighbor);
						}
					}
				}
			}
		}
	}

	private generateStructureTiles() {	
		let i = 2;
		this.structureTypeTiles.push([]);
		for (let _ in StructureType) {
			this.structureTypeTiles[i].push(new Map());
		}
		for (let [_, tile] of this.data) {
			for (let structureTypei in StructureType) {
				const structureType = parseInt(structureTypei);
				if (tile.structure_type == structureType) {
					const neighbors = this.getNeighbors(tile, i);
					for (let [_, neighbor] of neighbors) {
						this.structureTypeTiles[i][structureType].set(neighbor.x + neighbor.y * 12, neighbor);
					}
				}
			}
		}

		i = 3;
		this.structureColorTiles.push([]);
		for (let _ in StructureColor) {
			this.structureColorTiles[i].push(new Map());
		}
		for (let [_, tile] of this.data) {
			for (let structureColori in StructureColor) {
				const structureColor = parseInt(structureColori);
				if (tile.structure_color == structureColor) {
					const neighbors = this.getNeighbors(tile, i);
					for (let [_, neighbor] of neighbors) {
						this.structureColorTiles[i][structureColor].set(neighbor.x + neighbor.y * 12, neighbor);
					}
				}
			}
		}
	}

	private generateBiomeTiles() {
		for (let i = 0; i < 1; i++) {
			this.biomeTiles.push([]);
			for (let _ in Biome) {
				this.biomeTiles[i].push(new Map());
			}
			for (let [_, tile] of this.data) {
				for (let biomei in Biome) {
					const biome = parseInt(biomei);
					if (tile.biome == biome) {
						const neighbors = this.getNeighbors(tile, i);
						for (let [_, neighbor] of neighbors) {
							this.biomeTiles[i][biome].set(neighbor.x + neighbor.y * 12, neighbor);
						}
					}
				}
			}
		}
	
	}

	private static oddq_direction_differences = [
        // even cols 
        [[+1, 0], [+1, -1], [0, -1],
        [-1, -1], [-1, 0], [0, +1]],
        // odd cols 
        [[+1, +1], [+1, 0], [0, -1],
        [-1, 0], [-1, +1], [0, +1]],
    ]

    private static oddq_offset_neighbor(hex: { col: number, row: number }, direction: number) {
        var parity = hex.col & 1
        var diff = ClueGenerator.oddq_direction_differences[parity][direction]
        return [hex.col + diff[0], hex.row + diff[1]]
    }

	/**
	 * 
	 * 
	 * @param tile The tile to get the neighbors of
	 * @param distance The distance from the tile to get the neighbors of
	 * @returns The neighbors of the tile at the given distance
	 */
    public getNeighbors(tile: TileData, distance: number): Map<number, TileData> {
        const neighbors: Map<number, TileData> = new Map();
        let toVisit: TileData[] = [tile];
        let tmp: number[][] = [];

        while (distance >= 0) {
            while (toVisit.length > 0) {
                const current = toVisit.pop();
                if (current) {
					neighbors.set(current.x + current.y * 12, current);

                    for (let i = 0; i < 6; i++) {
                        const hex = { col: current.x, row: current.y };
                        // console.log(current, hex);
                        const neighbor_pos = ClueGenerator.oddq_offset_neighbor(hex, i);
                        tmp.push(neighbor_pos);
                    }
                }
            }
            for (const pos of tmp) {
                const tile = this.data.get(pos[0] + pos[1] * 12);
                if (tile) toVisit.push(tile);
            }
            tmp = [];
            distance--;
        }

        return neighbors;
    }
}
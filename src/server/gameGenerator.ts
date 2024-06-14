import Rand from "rand-seed";
import { TileData } from "../game/abstracts/tileData";
import blocks from "./original_blocks";
import { AnimalType, StructureColor, StructureType } from "../game/enums";

export function shuffleArray(array: any[], seed: string) {
    const rand = new Rand(seed == "" ? undefined : seed);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rand.next() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class ClueGenerator {
	private seed: string;
	private data: TileData[];
	// For each range, we store the tiles that are within that range of each animal type
	private animalTiles: TileData[][][] = []; // [range][AnimalType][]
	// For each range, we store the tiles that are within that range of each structure type
	private structureTypeTiles: TileData[][][] = []; // [range][StructureType][]
	// For each range, we store the tiles that are within that range of each structure color
	private structureColorTiles: TileData[][][] = []; // [range][StructureType][]

	// For more speed we could replace the TileData[][][] with a Map<string, TileData>[][] with the string being something like "x + y * 9"
	// So we could replace animalTiles[range][AnimalType].find(t => t.x === x && t.y === y) with animalTiles[range][AnimalType].get(x + y * 9)
	// This would be faster because the find function is O(n) while the get function is usually O(1)
	// TODO: Implement the above

	constructor(seed = "cryptide") {
		this.seed = seed;
		this.data = this.generateData();
	}

	private generateData(): TileData[] {
		const data: TileData[] = [];
		const sblocks = [...blocks];
		shuffleArray(sblocks, this.seed); // TODO: Handle block rotation

		for (let i = 0; i < 12; i++) {
			for (let j = 0; j < 9; j++) {
				const block_i = Math.floor(i / 6) + Math.floor(j / 3) * 2;
				const td = sblocks[block_i][(i % 6) + (j % 3) * 6];
				td.x = i;
				td.y = j;
				data.push(td);
			}
		}

		const rand = new Rand(this.seed);
		for (let typei in StructureType) {
			for (let colori in StructureColor) {
				const type = parseInt(typei);
				const color = parseInt(colori);
				const i = Math.floor(rand.next() * data.length);
				data[i].structure_type = type;
				data[i].structure_color = color;
			}
		}

		this.generateAnimalTiles();
		this.generateStructureTiles();
		return data;
	}

	private generateAnimalTiles() {
		for (let i = 1; i < 2; i++) {
			this.animalTiles.push([]);
			for (let _ in AnimalType) {
				this.animalTiles[i].push([]);
			}
			for (let tile of this.data) {
				for (let animalTypei in AnimalType) {
					const animalType = parseInt(animalTypei);
					if (tile.animal == animalType) {
						const neighbors = this.getNeighbors(tile, i);
						for (let neighbor of neighbors) {
							if (!this.animalTiles[i][animalType].find(t => t.x === neighbor.x && t.y === neighbor.y))
								this.animalTiles[i][animalType].push(neighbor);
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
			this.structureTypeTiles[i].push([]);
		}
		for (let tile of this.data) {
			for (let structureTypei in StructureType) {
				const structureType = parseInt(structureTypei);
				if (tile.structure_type == structureType) {
					const neighbors = this.getNeighbors(tile, i);
					for (let neighbor of neighbors) {
						if (!this.structureTypeTiles[i][structureType].find(t => t.x === neighbor.x && t.y === neighbor.y))
							this.structureTypeTiles[i][structureType].push(neighbor);
					}
				}
			}
		}

		i = 3;
		this.structureColorTiles.push([]);
		for (let _ in StructureColor) {
			this.structureColorTiles[i].push([]);
		}
		for (let tile of this.data) {
			for (let structureColori in StructureColor) {
				const structureColor = parseInt(structureColori);
				if (tile.structure_color == structureColor) {
					const neighbors = this.getNeighbors(tile, i);
					for (let neighbor of neighbors) {
						if (!this.structureColorTiles[i][structureColor].find(t => t.x === neighbor.x && t.y === neighbor.y))
							this.structureColorTiles[i][structureColor].push(neighbor);
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
    public getNeighbors(tile: TileData, distance: number): TileData[] {
        const neighbors: TileData[] = [];
        let toVisit: TileData[] = [tile];
        let tmp: number[][] = [];

        while (distance >= 0) {
            while (toVisit.length > 0) {
                const current = toVisit.pop();
                if (current) {
                    if (!neighbors.find(neighbor => neighbor.x === current.x && neighbor.y === current.y))
                        neighbors.push(current);

                    for (let i = 0; i < 6; i++) {
                        const hex = { col: current.x, row: current.y };
                        // console.log(current, hex);
                        const neighbor_pos = ClueGenerator.oddq_offset_neighbor(hex, i);
                        tmp.push(neighbor_pos);
                    }
                }
            }
            for (const pos of tmp) {
                const tile = this.data.find(tile => tile.x === pos[0] && tile.y === pos[1]);
                if (tile) toVisit.push(tile);
            }
            tmp = [];
            distance--;
        }

        return neighbors;
    }
}
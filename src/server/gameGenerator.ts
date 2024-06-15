import Rand from "rand-seed";
import { TileData } from "../game/abstracts/tileData";
import blocks from "./original_blocks";
import { AnimalType, Biome, StructureColor, StructureType } from "../game/enums";
import { Clue, InBiomeAmongTwoClue, InOrNextToBiomeOrAnimalClue, InOrWithin2OfAnimalOrStructureClue, InOrWithin3OfStructureColorClue } from "./clue";

export function shuffleArray(array: any[], seed: string) {
	const rand = new Rand(seed == "" ? undefined : seed);
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(rand.next() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

export class ClueGenerator {
	private seed: string;
	public data: Map<number, TileData> = new Map();
	// For each range, we store the tiles that are within that range of each animal type
	private animalTiles: Map<number, TileData>[][] = new Array(3); // [range][AnimalType][]
	// For each range, we store the tiles that are within that range of each structure type
	private structureTypeTiles: Map<number, TileData>[][] = new Array(3); // [range][StructureType][]
	// For each range, we store the tiles that are within that range of each structure color
	private structureColorTiles: Map<number, TileData>[][] = new Array(4); // [range][StructureType][]
	private biomeTiles: Map<number, TileData>[][] = new Array(2);

	// For more speed we replaced the TileData[][][] with a Map<number, TileData>[][] with the key being something like "x + y * width"
	// So we also replaced animalTiles[range][AnimalType].find(t => t.x === x && t.y === y) with animalTiles[range][AnimalType].get(x + y * 9)
	// This should be faster because the find function is O(n) while the get function is usually O(1)

	constructor(seed = "cryptide") {
		this.seed = seed;
		this.data = this.generateData();
		this.generateAnimalTiles();
		this.generateStructureTiles();
		this.generateBiomeTiles();
	}

	/**
	 * Generates the tile data for the game by shuffling the blocks and buildind the map out of it,
	 * then placing random structures
	 * then building the arrays of maps used to generate the clues.
	 * @returns A map of the data
	 */
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

		let structures = Object.values(StructureType);
		structures = structures.slice(structures.length / 2);
		let colors = Object.values(StructureColor);
		colors = colors.slice(colors.length / 2);

		const rand = new Rand(this.seed);
		for (let i = 0; i < structures.length; i++) {
			for (let j = 0; j < colors.length; j++) {
				const type = structures[i] as StructureType;
				const color = colors[j] as StructureColor;
				const id = Math.floor(rand.next() * data.size);
				data.get(id)!.structure_type = type;
				data.get(id)!.structure_color = color;
			}
		}

		return data;
	}

	/**
	 * For each range (here 1 and 2), for each animal type, we store the tiles that are within that range of that animal type
	 */
	private generateAnimalTiles() {
		let animals = Object.values(AnimalType);
		animals = animals.slice(animals.length / 2);

		for (let i = 1; i < 3; i++) {
			this.animalTiles[i] = [];
			for (let j = 0; j < animals.length; j++) {
				this.animalTiles[i].push(new Map());
			}
			for (let [_key, tile] of this.data) {
				for (let j = 0; j < animals.length; j++) {
					const animalType = animals[j] as AnimalType;
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

	/**
	 * For each range (here 2 and 3), for each structure type, we store the tiles that are within that range of that structure type
	 * For each range (here 3 and 4), for each structure color, we store the tiles that are within that range of that structure color
	 */
	private generateStructureTiles() {
		let structureTypes = Object.values(StructureType);
		structureTypes = structureTypes.slice(structureTypes.length / 2);
		let structureColors = Object.values(StructureColor);
		structureColors = structureColors.slice(structureColors.length / 2);


		let i = 2;
		this.structureTypeTiles[i] = [];
		for (let j = 0; j < structureTypes.length; j++) {
			this.structureTypeTiles[i].push(new Map());
		}
		for (let [_, tile] of this.data) {
			for (let j = 0; j < structureTypes.length; j++) {
				const structureType = structureTypes[i] as StructureType;
				if (tile.structure_type == structureType) {
					const neighbors = this.getNeighbors(tile, i);
					for (let [_, neighbor] of neighbors) {
						this.structureTypeTiles[i][structureType].set(neighbor.x + neighbor.y * 12, neighbor);
					}
				}
			}
		}

		i = 3;
		this.structureColorTiles[i] = [];
		for (let j = 0; j < structureColors.length; j++) {
			this.structureColorTiles[i].push(new Map());
		}
		for (let [_, tile] of this.data) {
			for (let j = 0; j < structureColors.length; j++) {
				const structureColor = structureColors[j] as StructureColor;
				if (tile.structure_color == structureColor) {
					const neighbors = this.getNeighbors(tile, i);
					for (let [_, neighbor] of neighbors) {
						this.structureColorTiles[i][structureColor].set(neighbor.x + neighbor.y * 12, neighbor);
					}
				}
			}
		}
	}

	/**
	 * For each biome, we store the tiles that are within that biome
	 */
	private generateBiomeTiles() {
		let biomes = Object.values(Biome);
		biomes = biomes.slice(biomes.length / 2);
		for (let i = 0; i < 2; i++) {
			this.biomeTiles[i] = [];
			for (let _ of biomes) {
				this.biomeTiles[i].push(new Map());
			}
			for (let [_, tile] of this.data) {
				for (let j = 0; j < biomes.length; j++) {
					const biome = biomes[j] as Biome;
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

	/**
	 * 
	 * @param hex An object with the col and row of the hex we want to get the neighbor of
	 * @param direction The direction of the neighbor (0 to 5)
	 * @returns 
	 */
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

	/**
	 * Finds all the clues that match the tile at the given position
	 * 
	 * @param x The x position of the tile to get the clues of
	 * @param y The y position of the tile to get the clues of
	 * @returns The possible clues for the tile at the given position
	 */
	private getAllPossibleClues(x: number, y: number): Clue[] {
		const id = x + y * 12;
		const tile = this.data.get(id);
		if (!tile) return [];

		let biomes = Object.values(Biome);
		biomes = biomes.slice(biomes.length / 2);
		let animals = Object.values(AnimalType);
		animals = animals.slice(animals.length / 2);
		let structures = Object.values(StructureType);
		structures = structures.slice(structures.length / 2);
		let colors = Object.values(StructureColor);
		colors = colors.slice(colors.length / 2);

		const clues: Clue[] = [];
		for (let i = 0; i < biomes.length - 1; i++) {
			for (let j = i + 1; j < biomes.length; j++) {
				const biome1 = biomes[i] as Biome;
				const biome2 = biomes[j] as Biome;
				const clue = new InBiomeAmongTwoClue(biome1, biome2);
				if (clue.filter(this.data).get(id)) clues.push(clue);
			}
		}

		for (let i = 0; i < biomes.length; i++) {
			const biome = biomes[i] as Biome;
			const clue = new InOrNextToBiomeOrAnimalClue(this.biomeTiles[1][biome], biome, AnimalType.NONE);
			if (clue.filter(this.data).get(id)) clues.push(clue);
		}
		for (let i = 0; i < animals.length; i++) {
			const amimal = animals[i] as AnimalType;
			if (animals[i] == AnimalType.NONE) continue;
			const clue = new InOrNextToBiomeOrAnimalClue(this.animalTiles[1][amimal], null, amimal);
			if (clue.filter(this.data).get(id)) clues.push(clue);
		}

		for (let i = 0; i < animals.length; i++) {
			for (let j = 0; j < structures.length; j++) {
				const animal = animals[i] as AnimalType;
				const structure = structures[j] as StructureType;
				if (animal == AnimalType.NONE && structure == StructureType.NONE) continue;
				const clue = new InOrWithin2OfAnimalOrStructureClue(this.animalTiles[2][animal],
					this.structureTypeTiles[2][structure], animal, structure);
				if (clue.filter(this.data).get(id)) clues.push(clue);
			} 
		}

		for (let i = 0; i < colors.length; i++) {
			const color = colors[i] as StructureColor;
			const clue = new InOrWithin3OfStructureColorClue(this.structureColorTiles[3][color], color);
			if (clue.filter(this.data).get(id)) clues.push(clue);
		}

		return clues;
	}

	/**
	 * Generates all the possible combinations of length n of the given clues
	 * 
	 * @param clues The clues to generate the combinations of
	 * @param n The length of the combinations
	 * @returns The combinations of length n of the given clues
	 */
	generateCluesCombination(clues: Clue[], n: number): Clue[][] {
		if (n == 0) return [];
		if (n == 1) return clues.map(clue => [clue]);
		const res: Clue[][] = [];
	
		for (let i = 0; i < clues.length; i++) {
			const remaining_clues = this.generateCluesCombination(clues.slice(i + 1), n - 1);
	
			for (const c of remaining_clues) {
				res.push([clues[i], ...c]);
			}
		}
	
		return res;
	}

	getPerfectClueSets(x: number, y: number, n: number) {
		const clues = this.getAllPossibleClues(x, y);
		const clues_combination = this.generateCluesCombination(clues, n);
		const perfect_clue_sets: Clue[][] = [];
		for (const clues of clues_combination) {
			let tmp = new Map(this.data);
			for (const clue of clues) {
				tmp = clue.filter(tmp);
				if (tmp.size == 0) break;
			}
			if (tmp.get(x + y * 12) && tmp.size === 1) {
				// console.log(tmp.length);
				perfect_clue_sets.push(clues);
			}
		}
		return perfect_clue_sets;
	}
}
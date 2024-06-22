export type Player =  {
    name: string;
    color: string;
}

export class Game {
    private static instance: Game;
    public players: Player[];
    private constructor() {
        this.players = [];
        this.players.push({name: "Player 1", color: "red"});
        this.players.push({name: "Player 2", color: "blue"});
        this.players.push({name: "Player 3", color: "green"});
        this.players.push({name: "Player 4", color: "yellow"});
     }

    public static getInstance(): Game {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
}
import { TileData } from "./game/abstracts/tileData";

export class NetworkInterface {
    private static async getData<T>(path: string, room: string, options?: any): Promise<T> {
        const op = options || {};
        op.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*"
        };
        op.method = "GET";
        const response = await fetch(`http://localhost:8081/${room}/${path}`, op);
        return response.json();
    }


    public static async getTileData(): Promise<Map<number, TileData>> {
        const result = await this.getData<Map<number, TileData>>("tiles", "cryptide2");
        const map = new Map<number, TileData>();
        for (let key in result) {
            map.set(parseInt(key), result[key]);
        }
        return map;
    }
}
import express, {Request, Response} from 'express';
import { ClueGenerator } from './gameGenerator';
import cors from "cors";

const app = express();
const port = 8080;

const clueGenerators: Map<string, ClueGenerator> = new Map();

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const mapToJson = (map: Map<any, any>) => {
    let obj: any = {};
    map.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}

app.get('/:room/tiles', (req: Request, res: Response) => {
    if (!req.params.room) {
        res.status(400).send('No room provided');
        return;
    }

    const room = req.params.room;
    let clueGenerator = clueGenerators.get(room);
    if (!clueGenerator) {
        clueGenerator = new ClueGenerator(room);
        clueGenerators.set(room, clueGenerator);
    }
    res.header("Access-Control-Allow-Origin", "*");
    return res.json(mapToJson(clueGenerator.data));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

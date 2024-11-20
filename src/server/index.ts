import express, {raw, Request, Response} from 'express';
import { ClueGenerator } from './gameGenerator';
import cors from "cors";

const app = express();
const port = 8081;

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

app.get('/:room/clues/:n/:x/:y', (req: Request, res: Response) => {
	if (!req.params.room) {
		res.status(400).send('No room provided');
		return;
	}

	if (!req.params.x || !req.params.y) {
		res.status(400).send('No x or y provided');
		return;
	}

	if (!req.params.n) {
		res.status(400).send('No number of player n provided');
		return;
	}

	const room = req.params.room;
	const x = parseInt(req.params.x);
	const y = parseInt(req.params.y);
	const n = parseInt(req.params.n);
	let clueGenerator = clueGenerators.get(room);
	if (!clueGenerator) {
		clueGenerator = new ClueGenerator(room);
		clueGenerators.set(room, clueGenerator);
	}
	res.header("Access-Control-Allow-Origin", "*");
	const clues = clueGenerator.getPerfectClueSets(x, y, n);
	if (clues.length === 0) {
		return res.status(404).send('No clues found');
	}
	return res.json({clues: clues[0].map(clue => clue.toString()), raw: clues[0]});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

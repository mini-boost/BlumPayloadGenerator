import {Router, type Request, type Response} from "express"
import {StatusCodes} from "http-status-codes"

import {appConstants} from "./configs";
import {generatePayload,  generateChallenge, checkRequestDataStructure} from "./generator"
import {Logger} from "./logger";
import {reqLog} from "./utils";

export const router = Router()

const log = new Logger("API")

let counter = 0

const debug = (req: Request, message: string): void => log.debug(`${reqLog(req)} | ${message}`);

router.get("/status", async (req: Request, res: Response) => {
    debug(req, "success");
    res.status(StatusCodes.OK).json({status: "ok", version: appConstants.GENERATOR_VERSION})
})

router.post("/getPayload", async (req: Request, res: Response) => {
    if (!checkRequestDataStructure(req.body)) {
        debug(req, "error - Incorrect request body structure")
        res.status(StatusCodes.BAD_REQUEST).json({error: "Incorrect request body structure."});
        return;
    }
    try {
        const gameId = req.body.gameId;
        const earnedPoints = req.body.earnedPoints;
        const assetClicks = req.body.assetClicks;

        let generationTime = Date.now();
        const wasmData = {gameId, earnedPoints, assetClicks, challenge: generateChallenge(gameId)};
        const payload = generatePayload(wasmData);
        generationTime = Date.now() - generationTime;

        const assetClicksText = Object.keys(assetClicks).map(key => `${key}: ${assetClicks[key].clicks}`).join(" ");
        const status = `earn: ${earnedPoints}, assetClicks: ${assetClicksText}`;
        const debugTest = gameId === appConstants.TEST_GAME_ID ?
            "successful test generate payload to game" :
            `[${counter++}] generated (${generationTime}ms) payload to game: ${gameId}, ${status}`;
        debug(req, debugTest);
        res.status(StatusCodes.OK).json({payload: payload,...wasmData});
    } catch (e) {
        // @ts-ignore
        const error: Error = e;
        debug(req, `error - ${error}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
})


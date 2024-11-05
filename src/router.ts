import {Router, type Request, type Response} from "express"
import {StatusCodes} from "http-status-codes"

import {
    generatePayload,
    generateChallenge,
    GameIdNotSetError
} from "./generator"
import {Logger} from "./logger";
import {reqLog} from "./utils";


export const router = Router()

const log = new Logger("API")

let counter = 0

const debug = (req: Request, message: string): void => log.debug(`${reqLog(req)} | ${message}`);

router.get("/status", async (req: Request, res: Response) => {
    debug(req, "success");
    res.status(StatusCodes.OK).json({status: "ok"})
})

router.post("/getPayload", async (req: Request, res: Response) => {
    try {
        const gameId = req.body.gameId;
        const earnedPoints = req.body.earnedPoints;
        const assetClicks = req.body.assetClicks;
        let generationTime = Date.now()
        let wasmData = {
            gameId: gameId,
            challenge: generateChallenge(gameId),
            earnedPoints: earnedPoints,
            assetClicks: assetClicks
        };
        const payload = generatePayload(wasmData);
        generationTime = (Date.now() - generationTime)
        const assets = JSON.stringify({earnedPoints: earnedPoints, assetClicks: assetClicks})
        debug(req, `[${counter++}] generated (${generationTime}ms) payload to game: ${gameId}, assets: ${assets}`);
        res.status(StatusCodes.OK).json({
            payload: payload,
            ...wasmData,
        })
    } catch (e) {
        const statusCode = e instanceof GameIdNotSetError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR
        // @ts-ignore
        const error: Error = e
        res.status(statusCode).json({error: error.message})
    }
})


import {Request} from "express";

export function reqLog(req: Request) : string {
    return `${req.url} | ${req.hostname}`
}
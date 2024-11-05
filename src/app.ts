import express from "express";
import dotenv from "dotenv";
import {router} from "./router";
import {loadWasmFileForGenerator} from "./generator";
import {showLogo, showAdMessages} from "./logo";

dotenv.config()

const PORT = process.env.PORT || 9876;
const gameWasmFile = "blum-includes/game_wasm_bg-DYwJl-6R.wasm";


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/', router);

async function start() {
    await loadWasmFileForGenerator(gameWasmFile);
}

start().then(() => {
    const nodeMajorVersion = parseInt(process.version.replace("v", "").split(".")[0])
    if (nodeMajorVersion < 20) {
        return console.error(`Min version Node.js - 20, you have ${process.version} version.`)
    }
    showLogo();
    showAdMessages();
    app.listen(PORT, () => {
        console.log(`Server Blum payload generator is started and listening on port ${PORT}`);
    });
})


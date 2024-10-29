import express from "express";
import dotenv from "dotenv";
import {router} from "./router";
import {loadWasmFileForGenerator} from "./generator";
import {showLogo} from "./logo";

dotenv.config()

const PORT = process.env.PORT || 9876;
const gameWasmFile = "blum-includes/game_wasm_bg-BnV071fP.wasm";


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/', router);

async function start() {
    await loadWasmFileForGenerator(gameWasmFile);
}

start().then(() => {
    showLogo()
    app.listen(PORT, () => {
        console.log(`Server Blum payload generator is started and listening on port ${PORT}`);
    });
})
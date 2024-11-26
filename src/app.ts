import express from "express";
import dotenv from "dotenv";
import {router} from "./router";
import {appConstants} from "./configs";
import {loadWasmFileForGenerator} from "./generator";
import {startText} from "./logo";

dotenv.config()

const PORT = process.env.PORT ? parseInt(process.env.PORT) : appConstants.DEFAULT_PORT;
const generatorWasmPath = `${appConstants.INCLUDES_PATH}/${appConstants.GENERATOR_WASM_FILENAME}`;


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/', router);

async function start() {
    const nodeMajorVersion = parseInt(process.version.replace("v", "").split(".")[0])
    if (nodeMajorVersion < 20) {
        return console.error(`Min version Node.js - 20, you have ${process.version} version.`)
    }
    await loadWasmFileForGenerator(generatorWasmPath);


    console.log(startText);
    const onSuccess = `Server Blum payload generator (v${appConstants.GENERATOR_VERSION}) was started on port ${PORT}`
    // app.listen(PORT, () => console.log(onSuccess));
    app.listen(PORT, '127.0.0.1', () => {
        console.log(onSuccess);
    });
}

start().then()
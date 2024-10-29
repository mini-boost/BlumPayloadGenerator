import express from "express"
import {router} from "./router.ts"
import {loadWasmFileForGenerator} from "./generator.ts"

const PORT = 7000
const gameWasmFile = "./dumps/game_wasm_bg-BnV071fP.wasm"


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/', router)

async function start() {
    await loadWasmFileForGenerator(gameWasmFile)
}

start().then(() => {
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
})
import {generateChallenge, generatePayload, loadWasmFileForGenerator} from "./generator";

const gameWasmFile = "blum-includes/game_wasm_bg-BnV071fP.wasm"

function test_1() {

    const gameId = "ad7cd4cd-29d1-4548-89a3-91301996ef31";
    const challengeHash = "0000467a51e7680d8a3c36d18b240697fb844dd269e21989f24044acddf10228"
    const challengeNonce = 16353
    const earnedAssets = {CLOVER: {amount: "180"}};

    const challenge = generateChallenge(gameId);

    if (challenge.hash !== challengeHash) {
        console.log(`Calculated: ${challenge.hash}, specified: ${challengeHash}`);
        throw Error("Challenge hash did not match the specified.")
    }

    if (challenge.nonce !== challengeNonce) {
        console.log(`Calculated: ${challenge.nonce}, specified: ${challengeNonce}`);
        throw Error("Challenge nonce did not match the specified.")
    }

    let wasmData = {
        gameId: gameId,
        challenge: challenge,
        earnedAssets: earnedAssets
    };

    const payload = generatePayload(wasmData);

    if (payload.length !== 684) {
        console.log(`Payload length (${payload.length}) not eq, specified - 684`);
        throw Error("The payload length did not match the specified length.")
    }
}


async function main() {
    await loadWasmFileForGenerator(gameWasmFile)
    test_1()
    console.log("All test ok!")
}

main().then()
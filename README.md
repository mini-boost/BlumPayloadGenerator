# Blum Payload Generator API 

two methods:
1. GET /status - return {"status": "ok} if all ok
2. POST /getPayload - return payload and another data. 
   
    request body : {"gameId": "ad7...", "earnedAssets": {"CLOVER": {"amount": "180"}}} 
const express = require('express')
const axios = require('axios')
require('dotenv').config()
const server = express()
server.use(express.json())
const steamKey = process.env.STEAM_API_KEY
server.get('/steamid/:steamNick', async(req, res) => {
  const steamId = await getSteamId(req.params.steamNick)
  
  res.send(steamId)
})

server.get('/steaminfo/:steamId', async(req, res) => {
  const steamInfo = await getSteamInfo(req.params.steamId)
  res.send(steamInfo)
})

async function getSteamInfo(steamId){
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=${steamId}`
  const fullReq = await axios.get(url).then((resp) => {
    const fullResponse = resp.data.response.players[0]
    const playerNick = fullResponse.personaname
    const playerId = JSON.stringify(fullResponse.steamid)
    return JSON.stringify(fullResponse)
  }).catch((error => console.log(error)))
  return fullReq
}

async function getSteamId(steamNick){
  const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamKey}&vanityurl=${steamNick}`
  const steamId = await axios.get(url).then((resp) => {
    return JSON.stringify(resp.data.response.steamid)
    //console.log(JSON.stringify(resp.data.response.steamid))
  })
  .catch((error) => console.log(error))
  return steamId
}

server.listen(3000)
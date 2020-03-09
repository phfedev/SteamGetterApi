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

server.get('/steamgames/:steamId', async(req, res) => {
  const steamGames = await getSteamGames(req.params.steamId)
  res.send(steamGames)
})

async function getSteamInfo(steamId){
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=${steamId}`
  const fullReq = await axios.get(url).then((resp) => {
    const fullResponse = resp.data.response.players[0]
    return JSON.stringify(fullResponse)
  }).catch((error => console.log(error)))
  return fullReq
}

async function getSteamId(steamNick){
  const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamKey}&vanityurl=${steamNick}`
  const steamId = await axios.get(url).then((resp) => {
    return JSON.stringify(resp.data.response.steamid)
  })
  .catch((error) => console.log(error))
  return steamId
}

async function getSteamGames(steamId){
  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamKey}&steamid=${steamId}&format=json`
  
  const steamGames = await axios.get(url).then((resp) => {
    return resp.data.response
  }).catch((error) => console.log(error));

  const games = steamGames.games
  const gameIds = []
  const gameNames = []
  for(game in games){
    gameIds.push(games[game].appid)
    
  }
  for(pos in gameIds){
    let gameName = await getGameInfo(gameIds[pos])
    if(gameName != ""){
      gameNames.push(gameName)
    }
  }

  return gameNames
}

async function getGameInfo(gameId){
  
  const url = `https://store.steampowered.com/api/appdetails?appids=${gameId}`
  let gameName ="";
  const gameInfo = await axios.get(url).then((resp) => {
    return resp.data
  }).catch((error) => console.log(error))

  Object.keys(gameInfo).forEach(function (key) {
    if(gameInfo[key].success == true){
      console.log(key)
      console.log(gameInfo[key].data.name);
      gameName = gameInfo[key].data.name
    }else{
      return
    }
  });

  return gameName
}

server.listen(3000)



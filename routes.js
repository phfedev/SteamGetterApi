const express = require('express')
const steamController = require('./controller/steamController')
const routes = express.Router()

routes.get('/steamid/:steamNick', async(req, res) => {
  const steamId = await steamController.getSteamId(req.params.steamNick)
  
  res.send(steamId)
})

routes.get('/steaminfo/:steamId', async(req, res) => {
  const steamInfo = await steamController.getSteamInfo(req.params.steamId)
  res.send(steamInfo)
})

routes.get('/steamgames/:steamId', async(req, res) => {
  const steamGames = await steamController.getSteamGames(req.params.steamId)
  res.send(steamGames)
})

routes.get('/steamfriends/:steamId', async(req, res) => {
  const steamFriends = await steamController.getSteamFriends(req.params.steamId)
  res.send(steamFriends)
})

module.exports = routes
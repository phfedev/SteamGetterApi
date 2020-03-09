const express = require('express')
const axios = require('axios')

const server = express()
server.use(express.json())
const steamKey = 'DA58E9E5030428339131C3A32583A210'
server.get('/steam/:steamNick', async(req, res) => {
  //const urlGetSteamIdByNick = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=DA58E9E5030428339131C3A32583A210&vanityurl=${req.params.steamNick}`
  const steamId = await getSteamId(req.params.steamNick)
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=DA58E9E5030428339131C3A32583A210&steamids=${steamId}`
  axios.get(url).then((resp) => {
    //response.players[0].steamid
    const player = resp.data
    console.log(JSON.stringify(player.response.players[0].personaname))
  })
  res.send('test')
  //res.send('SteamID' + req.params.id)
})



async function getSteamId(steamNick){
  const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=DA58E9E5030428339131C3A32583A210&vanityurl=${steamNick}`
  const steamId = await axios.get(url).then((resp) => {
    return JSON.stringify(resp.data.response.steamid)
    //console.log(JSON.stringify(resp.data.response.steamid))
  })
  .catch((error) => console.log(error))
  return steamId
}

server.listen(3000)
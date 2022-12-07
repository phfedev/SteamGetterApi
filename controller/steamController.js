const axios = require('axios')
require('dotenv').config()

const steamKey = process.env.STEAM_API_KEY
module.exports = {
  async getSteamFriends(steamId) {
    const friendsId = []
    const friendsNick = []
    const url = `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${steamKey}&steamid=${steamId}&relationship=friend`
    const fullReq = await axios.get(url).then(async (resp) => {
      for (pos in resp.data.friendslist.friends) {
        friendsId.push(resp.data.friendslist.friends[pos].steamid)
        let friend = await this.getSteamInfo(friendsId[pos])
        friendsNick.push(friend.personaname)
      }
      return friendsNick
    }).catch((error => console.log(error)))
    return fullReq
  },

  async getSteamInfo(steamId) {
    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=${steamId}`
    const fullReq = await axios.get(url).then((resp) => {
      const fullResponse = resp.data.response.players[0]
      return fullResponse
    }).catch((error => console.log(error)))
    return fullReq
  },

  async getSteamId(steamNick) {
    const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamKey}&vanityurl=${steamNick}`
    const steamId = await axios.get(url).then((resp) => {
      return JSON.stringify(resp.data.response.steamid)
    })
      .catch((error) => console.log(error))
    return steamId
  },

  async getSteamGames(steamId) {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamKey}&steamid=${steamId}&format=json`

    const steamGames = await axios.get(url).then((resp) => {
      return resp.data.response
    }).catch((error) => console.log(error));

    const games = steamGames.games
    const gameIds = []
    const gameNames = []
    for (game in games) {
      gameIds.push(games[game].appid)
    }
    for (pos in gameIds) {
      let gameName = await this.getGameInfo(gameIds[pos])
      if (gameName != "") {
        gameNames.push(gameName)
      }
    }
    return gameNames
  },

  async getGameInfo(gameId) {

    const url = `https://store.steampowered.com/api/appdetails?appids=${gameId}`
    let gameName = "";
    const gameInfo = await axios.get(url).then((resp) => {
      return resp.data
    }).catch((error) => console.log(error))

    Object.keys(gameInfo).forEach(function (key) {
      if (gameInfo[key].success == true) {
        console.log(key)
        console.log(gameInfo[key].data.name);
        gameName = gameInfo[key].data.name
      } else {
        return
      }
    });
    return gameName
  }
}


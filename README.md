# mynt-discord-bot

Dependencies:
npm install discord.js
npm install node-binance-api
npm install node-bittrex-api
npm install bitcoin-core
npm install sqlite3
npm install axios

Create a secrets.json file in the root directory:
```
{
    "token"  : "discord.secret.token.goes.here",
    "prefix" : ".",
    "prefix_crypto" : "$",
    // "port": 5000,
    // "invite_url": "https://discordapp.com/oauth2/authorize?client_id=401249077657993246&scope=bot&permissions=224321",
    "colors": {
      "main": [0, 204, 0],
      "error": [255, 0, 0]
    },
    "exchanges": {
      "binance": {
        "api_key": "xxx",
        "api_secret": "xxx"
      },
      "bittrex": {
        "api_key": "xxx",
        "api_secret": "xxx"
      }
    },
    "default_base": "BTC",
    "default_decimals": 8,
    "other_base_displays": {
      "BTC": 8,
      "USD": 2
    }
  }
```

const axios = require('axios');

// axios.get('https://swiftex.co/api/v2/tickers')
//   .then(response => {
//     console.log(response.data);
//     console.log(response.data.tickers);
//   })
//   .catch(error => {
//     console.log(error);
//   });

  axios.all([
    axios.get('https://swiftex.co/api/v2/tickers'),
    axios.get('https://swiftex.co/markets/mynt-btc')
  ]).then(axios.spread((response1, response2) => {
    // console.log(response1.data);
    // console.log(response2.data);
  })).catch(error => {
    console.log(error);
  });


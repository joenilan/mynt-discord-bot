const RichEmbed = require('discord.js').RichEmbed;

const BinanceAPI = require('node-binance-api');

const cache = require('../cache');

function getMarketPrice(currency, base) {
  let price;
  Object.keys(cache).some(market => {
    if (
      market === (currency + base).toUpperCase() ||
      market === (base + currency).toUpperCase()
    ) {
      price = cache[market].price;
      if (typeof price === 'number') {
        price = price.toString();
      }
      return true;
    }
    return false;
  });
  return price;
}

function getPrice(currency, base, decimals) {
  if (currency === base) return 1;
  let price;
  if (base === 'USD') {
    let btcPerUsd = parseFloat(getMarketPrice('BTC', 'USDT'));
    if (currency === 'BTC') return parseFloat(btcPerUsd.toFixed(8)).toString();
    price = parseFloat(getMarketPrice(currency, 'BTC'));
    if (price == null) return null;
    price *= btcPerUsd;
  } else {
    price = getMarketPrice(currency, base);
    if (price == null) return null;
    price = parseFloat(price);
  }
  let finalPrice = parseFloat(price.toFixed(decimals));
  if (isNaN(finalPrice)) {
    return null;
  }
  return finalPrice.toString();
}

function getData(currency, base, callback) {
  let data = cache[currency + (base === 'USD' ? 'USDT' : base)];
  if (!data) return null;
  if (data.volume) {
    if (data.change) {
      data.change = parseFloat(data.change.toFixed(2));
    }
    callback(data);
  } else {
    BinanceAPI.candlesticks(currency + base, '1d', (ticks, symbol) => {
      if (ticks) {
        let tick = ticks[ticks.length - 1];
        if (tick) {
          data.high = parseFloat(tick[2]);
          data.low = parseFloat(tick[3]);
          data.volume = parseFloat(tick[5]);
        }
      }
      BinanceAPI.prevDay(
        currency + (currency === 'BTC' ? 'USDT' : 'BTC'),
        (prevDay, symbol) => {
          if (prevDay) {
            data.change = parseFloat(
              parseFloat(prevDay.priceChangePercent).toFixed(2)
            );
          }
          callback(data);
        }
      );
    });
  }
}

module.exports = (client, config) => {
  return {
    aliases: ['price'],
    usage: 'price (currency) (base [BTC])',
    description:
      'Display price of (currency) in relation to (base) along with other data.',
    onCommand: (event, member, channel, args) => {
      if (args.length === 0) {
        let embed = new RichEmbed()
          .setColor(config.colors.error)
          .setTitle('Incorrect usage!')
          .addField(
            'Syntax',
            `${config.crypto_prefix}price (currency) (base default: BTC)`
          )
          .addField('Example', `${config.crypto_prefix}price xrp eth`)
          .setAuthor(
            'Requested by ' + member.displayName,
            event.author.avatarURL
          )
          .setTimestamp();
        channel.send({ embed }).catch(console.error);
        return;
      }

      let currency = args[0].toUpperCase();
      let defaultBase =
        currency === 'BTC'
          ? 'USDT'
          : (args[1] || config.default_base).toUpperCase() || 'BTC';
      if (defaultBase === 'USDT') defaultBase = 'USD';

      let price = getPrice(currency, defaultBase, config.default_decimals);

      if (price == null) {
        let embed = new RichEmbed()
          .setColor(config.colors.error)
          .setTitle(
            "Unknown market. Make sure you're using abbreviations (e.g. BTC not Bitcoin)"
          )
          .setAuthor(
            'Requested by ' + member.displayName,
            event.author.avatarURL
          )
          .setTimestamp();
        channel.send({ embed }).catch(console.error);
        return;
      }

      let embed = new RichEmbed()
        .setColor(config.colors.main)
        .addField(currency + '/' + defaultBase, price);
      Object.keys(config.other_base_displays || {}).forEach(base => {
        let baseUpper = base.toUpperCase();
        if (baseUpper === 'USDT') baseUpper = 'USD';
        if (baseUpper !== defaultBase) {
          let otherPrice = getPrice(
            currency,
            baseUpper,
            config.other_base_displays[base] || config.default_decimals
          );
          if (otherPrice != null) {
            embed.addField(
              currency.toUpperCase() + '/' + baseUpper,
              otherPrice
            );
          }
        }
      });
      embed.addField(
        'Please wait',
        'Attempting to load more data... <a:loading:401678813605527552>'
      );

      channel.send({ embed }).then(message => {
        embed.fields.splice(embed.fields.length - 1, 1);
        getData(currency, defaultBase, data => {
          if (defaultBase === 'USDT') defaultBase = 'USD';
          if (data) {
            if (data.volume) {
              embed
                .addField('24hr High', `${data.high.toString()} ${defaultBase}`)
                .addField('24hr Low', `${data.low.toString()} ${defaultBase}`)
                .addField(
                  '24hr Volume',
                  `${data.volume.toString()} ${currency}`
                );
            }
            if (data.change) {
              embed.addField(
                '24hr Change',
                `${data.change}% ${data.change > 0 ? '📈 ⤴' : '📉 ⤵'}`
              );
            }
          }
          embed
            .setAuthor(
              'Requested by ' + member.displayName,
              event.author.avatarURL
            )
            .setTimestamp();
          message.edit({ embed }).catch(console.error);
        });
      });
    }
  };
};
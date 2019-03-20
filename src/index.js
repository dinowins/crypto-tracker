import $ from 'jquery';
import './sass/styles.scss';
import { CoinRater } from './api.js'

// JavaScript goes here!
$(document).ready(function() {
  var Promise = require('es6-promise').Promise;
  $('#coinlayer').click(function() {

    let year = $("#year").val();
    let month = $("#month").val();
    let day = $("#day").val();
    let coinRater = new CoinRater();
    let promise1 = coinRater.liveRate();
    let promise2 = coinRater.historicalRate(`${year}-${month}-${day}`);


    Promise.all([promise1, promise2]).then(function(responses) {
      let body1 = JSON.parse(responses[0]);
      let body2 = JSON.parse(responses[1]);
      const coinsNow = Object.keys(body1.rates);
      let htmlString = "<p>Change in coin value in past week, as a percentage:</p>";
      coinsNow.forEach(function(coin) {
        let difference;
        if (body2.rates[coin] != 0) {
          difference = 100 * (body1.rates[coin] - body2.rates[coin]) / body2.rates[coin];
        } else {
          difference = 'undefined';
        }
        htmlString += `<p>${coin}: ${difference}%</p>`;
      });
      $(".output").append(htmlString);
    }, function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error.responseText}. Please try again.`);
    });
  });
});

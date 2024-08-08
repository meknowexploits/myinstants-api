var express = require('express');
var cheerio = require('cheerio');
var axios = require('axios');

var app = express();

app.get('/search', async function (req, res) {
    var searchTerm = req.query.name || 'trapezio';
    var url = 'https://www.myinstants.com/search/?name=' + encodeURIComponent(searchTerm);

    try {
        const response = await axios.get(url);
        var $ = cheerio.load(response.data);

        var responseArray = [];

        $('.instant').each(function (i, elem) {
            var buttonName = $(this).find('.instant-link').text().trim() || 'Unbekannt';
            var smallButton = $(this).find('.small-button');

            if (smallButton.length && smallButton.attr('onclick')) {
                var onclickAttr = smallButton.attr('onclick');
                var buttonUrl = onclickAttr.split("('")[1].split("')")[0];
                var fullButtonUrl = 'https://www.myinstants.com' + buttonUrl;

                var item = {
                    name: buttonName,
                    url: fullButtonUrl
                };

                responseArray.push(item);
            }
        });

        res.json(responseArray);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Fehler beim Abrufen der Daten' });
    }
});

app.listen(3000, function () {
    console.log('Server runs on: http://localhost:3000');
});

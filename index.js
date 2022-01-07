const PORT    = 8000;
const express = require('express');
const axios   = require('axios');
const cheerio = require('cheerio');
const res     = require('express/lib/response');

const app     = express();
var spaces    = [];

axios.get('https://coworkingmap.org/map/?format=json&key=LG7WsM7ufvhhTMLK3NJawkSH')
    .then((response) => {
        response.data.forEach(element => {
            element.slug = element.url.replace(/(^https:\/\/coworkingmap.org\/)/gi, '').replace('\/', '');
            spaces.push(element);
        });
    })  
.catch(function (error) {
    console.log(error)
});

app.get('/', (req, res) => {
    res.json(  
    {
        'title': 'Welcome to my little Coworking Spaces Api.',
        'description': 'I use the page https://coworkingmap.org/ as a source for my data by utilizing their public google maps API and parsing their frontend through cheerio.',
        'routes': [
            '/spaces',
            '/spaces/sleevesup-hannover/'
        ]
    });
});

app.get('/spaces', (req, res) => {
    res.json(spaces);
});

app.get('/spaces/:spaceIdentifier', async(req, res) => {
    const spaceIdentifier = req.params.spaceIdentifier;
    const space           = spaces.filter(space => spaceIdentifier === space.slug)[0];

    axios.get(space.url)
    .then(response =>  {
        const html = response.data;
        const $    = cheerio.load(html);

        space['subTitle']    = $('h2', html).first().text();
        space['description'] = $('p.description', html).first().text();
        space['website']     = $('a[itemprop="url"]', html).first().text();
        space['cover-photo'] = $('.space-image img', html).first().attr('src');
        space['logo']        = $('.logo-space img[itemprop="logo"]', html).first().attr('src');

        let prices = [];

        $('ul.table-list li', html).each(function() {
            let priceTitle = $(this).children('.col-double').children('.title').children('strong').text();
            let personHint = $(this).children('.col-double').children('.title').children('span').text().replace('\n', '');
            let legend     = $(this).children('.col-double').children('.legend').text();
            let price      = $(this).children('.price').text();
            let frequency  = $(this).children('.frequency').text();
            
            prices.push({
                priceTitle,
                personHint,
                legend,
                price,
                frequency
            });
        });

        space['prices'] = prices;

        res.json(space)
    })
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

const PORT      = 8000;
const express   = require('express');
const axios     = require('axios');
const cheerio   = require('cheerio');
const cors      = require('cors')
const cache     = require('memory-cache');
const config    = require('./config');
const connectDB = require("./models/db")
const database  = "coworking_explorer"
const Spaces    = require("./models/Spaces");

var app         = express()
var corsOptions = {
    origin: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
   
app.use(cors(corsOptions));
let memCache = new cache.Cache();

var cacheRequest = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = memCache.get(key);

        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                memCache.put(key, body, duration * 1000);
                res.sendResponse(body);
            }
            next();
        }
    }
}

app.get('/sync', (req, res) => {
    
    syncSpaces().then(function(count) {
        res.json({count:count});
    }).catch(err => {
        console.log(err)
    });
});

app.get('/', cacheRequest(config.cacheTTL), (req, res) => {
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

app.get('/spaces', cacheRequest(config.cacheTTL), (req, res) => {

    let north = parseFloat(req.query.north);
    let south = parseFloat(req.query.south);
    let east = parseFloat(req.query.east);
    let west = parseFloat(req.query.west);

    let minLat = 0;
    let maxLat = 0;
    let minLng = 0;
    let maxLng = 0;

    if (!north || !south || !east || !west) {
        let lat = parseFloat(req.query.lat);
        let lng = parseFloat(req.query.lng);
        let zoom = req.query.zoom;
    
        if (!lat || !lng) {
            lng = 10.000654;
            lat = 53.550341;
        }
    
        if (!zoom) {
            zoom = 12;
        }
        let range = 10 / zoom;

        minLat = lat - range;
        maxLat = lat + range;
        minLng = lng - range;
        maxLng = lng + range;

    } else {
        minLat = south;
        maxLat = north;
        minLng = west;
        maxLng = east;
    }

    connectDB("mongodb://127.0.0.1:27017/"+database)
    Spaces.find(
        { 
            lat: 
                {
                    $gte: minLat,
                    $lte: maxLat,
                },
            lng:
                {
                    $gte: minLng,
                    $lte: maxLng,
                }
        
        }, (err, spaces)=>{ 
        if(err) throw err
        res.json(spaces);
        // mongoose.disconnect()
    })
});

app.get('/spaces/:spaceIdentifier', cacheRequest(config.cacheTTL), async(req, res) => {
    const spaceIdentifier = req.params.spaceIdentifier;
    connectDB("mongodb://127.0.0.1:27017/"+database)

    Spaces.findOne({identifier:spaceIdentifier}, (err, space)=>{ 
        if(err) throw err
        
        if (space.logo && space.largeCoverPhoto) {
            res.json(space);
            return;
        }

        axios.get(space.url).then(response =>  {
            const html = response.data;
            const $    = cheerio.load(html);

            space['subTitle']    = $('h2', html).first().text();
            space['description'] = $('p.description', html).first().text();
            let website          = $('a[itemprop="url"]', html).first().text().replace(/[^A-Z0-9\/\:\.\_\-\&\?]/ig, '');
            if (!website.match(/^[a-zA-Z]+:\/\//)) {
                website = 'http://' + website;
            }
            space['website']         = website;
            space['largeCoverPhoto'] = $('.space-image img', html).first().attr('src');
            space['logo']            = $('.logo-space img[itemprop="logo"]', html).first().attr('src');

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

            try {
                // Connect to database
                Spaces.findOneAndUpdate(
                    {
                        identifier: space.identifier
                    }, 
                    space, 
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }, function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    console.log("Document " + result['id'] +  " updated!")
                });
            } catch(err) {
            console.log(err);
            }
            res.json(space)
        })
        
        // mongoose.disconnect()
    })

    return;
    
});

async function syncSpaces() {
    var spaces = [];
    var count  = 0;

    await axios.get('https://coworkingmap.org/map/?format=json&key=LG7WsM7ufvhhTMLK3NJawkSH',)
    .then((response) => {
        response.data.forEach(element => {
            element.slug = element.url.replace(/(^https:\/\/coworkingmap.org\/)/gi, '').replace('\/', '');
            spaces.push(element);
        });

        cache.put('spaces', spaces);

        for (const space of spaces) {    
            connectDB("mongodb://127.0.0.1:27017/"+database)

            if (!space['map']) {
                continue;
            }
            
            let spaceData = {
                id: space['ID'],
                name: space['name'],
                url: space['url'],
                identifier: space['slug'],
                smallCoverPhoto: space['cover-photo'],     // For Map
                lat: space['map']['lat'],
                lng: space['map']['lng'],
                zoom: space['map']['zoom'],
                streetNumber: space['map']['street_number'],
                streetName: space['map']['street_name'],
                streetNameShort: space['map']['street_name_short'],
                city: space['map']['city'],
                state: space['map']['state'],
                postCode: space['map']['post_code'],
                country: space['map']['country'],
                countryShort: space['map']['country_short'],
            }
    
            try {
                // Connect to database
                Spaces.findOneAndUpdate(
                    {
                        identifier: spaceData.identifier
                    }, 
                    spaceData, 
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }, function(err, result) {
                    if (err) throw err;
                });
                count++;
            } catch(err) {
                return err;
            }
        }
        return count;
    })
    .catch(function (error) {
        console.log(error)
    });
    return count;
}

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

# coworking-explorer-api

# Start Server
npm start

# Routes
GET /spaces
```json
[
  {
    "ID": 19787,
    "country": "Germany",
    "city": "Hannover",
    "cover-photo": "https://coworkingmap.org/wp-content/uploads/2022/01/su-hannover-city-004-1920x800-1-300x160.jpg",
    "map": {
      "address": "Bödekerstraße 1, 30161 Hannover, Germany",
      "lat": 52.3790184,
      "lng": 9.753683299999999,
      "zoom": 4,
      "place_id": "ChIJSaC5N1MLsEcRRQMATWB4d84",
      "name": "Bödekerstraße 1",
      "street_number": "1",
      "street_name": "Bödekerstraße",
      "city": "Hannover",
      "state": "Niedersachsen",
      "state_short": "NDS",
      "post_code": "30161",
      "country": "Germany",
      "country_short": "DE"
    },
    "name": "SleevesUp! Hannover",
    "url": "https://coworkingmap.org/sleevesup-hannover/",
    "slug": "sleevesup-hannover"
  },...
]
```

GET /spaces/{identifier}

```json
{
  "ID": 19787,
  "country": "Germany",
  "city": "Hannover",
  "cover-photo": "https://coworkingmap.org/wp-content/uploads/2022/01/su-hannover-city-004-1920x800-1-705x294.jpg",
  "map": {
    "address": "Bödekerstraße 1, 30161 Hannover, Germany",
    "lat": 52.3790184,
    "lng": 9.753683299999999,
    "zoom": 4,
    "place_id": "ChIJSaC5N1MLsEcRRQMATWB4d84",
    "name": "Bödekerstraße 1",
    "street_number": "1",
    "street_name": "Bödekerstraße",
    "city": "Hannover",
    "state": "Niedersachsen",
    "state_short": "NDS",
    "post_code": "30161",
    "country": "Germany",
    "country_short": "DE"
  },
  "name": "SleevesUp! Hannover",
  "url": "https://coworkingmap.org/sleevesup-hannover/",
  "slug": "sleevesup-hannover",
  "subTitle": "Coworking Space in Hannover, Germany",
  "description": "Der SleevesUp! Coworking Space Hannover befindet sich in einem schönen Altbau mit klassischen hohen Wänden und stilvollem Stuck. In der Oststadt der niedersächsischen Metropole Hannover stehen auf 1.230 Quadratmetern flexible Arbeitsplätze im Coworking Space sowie voll ausgestattete Büros für kleine Teams und größere Unternehmen zur Verfügung. Außerhalb der eigenen Bürofläche ermöglichen die großzügigen Loungebereiche genügend Platz für eine entspannte Pause und kreativen Austausch mit der Community. Im UG finden sich moderne Meeting- und Seminarräume für 4–12 Personen. Damit du machen kannst, sind unsere voll ausgestatteten Büroräumlichkeiten inklusive Rundum-Service sofort bezugsfertig.\n",
  "website": " https://www.sleevesup.de/spaces/hannover-city/",
  "prices": [
    {
      "priceTitle": "Day Pass",
      "personHint": "1 person",
      "legend": "Use a coworking desks for a full day. Other services are also included.",
      "price": "EUR 15.00 ",
      "frequency": "Day"
    },
    {
      "priceTitle": "SleevesUp! Membership",
      "personHint": "1 person",
      "legend": "Book a fully furnished coworking desk with an ergonomic chair and lamp.",
      "price": "EUR 120.00 ",
      "frequency": "Month"
    },
    {
      "priceTitle": "SleevesUp!",
      "personHint": "2 people",
      "legend": "Book a fully furnished private office. ",
      "price": "EUR 600.00 ",
      "frequency": "Month"
    }
  ]
}
```

# Sources
https://coworkingmap.org/
Inspired by: Build a Web Scraper (super simple!)- by Code with Ania Kubów (https://www.youtube.com/watch?v=-3lqUHeZs_0)

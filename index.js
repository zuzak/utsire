var request = require('request')
var htmlparser = require('htmlparser2')

var utsire = module.exports = {
  get: function (callback) {
    request("http://www.metoffice.gov.uk/weather/marine/shipping_printable.html", function(e, r, b) {
      if (e) {
        throw e
      }
      var curr = "", place = "", forecast = {}
      var parser = new htmlparser.Parser({
        onopentag: function (name, attribs) {
          curr = name
        },
        onclosetag: function (name) {
          curr = null
        },
        ontext: function (text) {
          switch (curr) {
            case "h1":
              if (text != "Shipping forecast") {
                throw "Does not appear to be the Shipping Forecast. (" + text + ")"
              } else {
                forecast.header = text
              }
              break;
            case "p":
              if (!forecast.header) {
                break
              }
              if (!forecast.intro) {
                forecast.intro = text
              } else if (!forecast.gales) {
                text = text.substr(31)
                text = text.substr(0, text.length - 1)
                text = text.split(', ')
                forecast.gales = text
              } else if (place == "SYNOPSIS") {
                forecast.synopsis.content = text
                place = "AREAS"
              } else if (place instanceof Array) {
                if(!forecast.areas) {
                  forecast.areas = {}
                }
                var areaforecast = {}
                areaforecast.string = text
                text = text.split('. ')

                areaforecast.wind = text[0]
                areaforecast.seastate = text[1]
                areaforecast.precipitation = text[2]
                areaforecast.visibility = text[3]
                areaforecast.shared = place

                for (var i = 0; i < place.length; i++) {
                  place[i] = place[i].trim()
                  place[i] = place[i].split('&nbsp;')[0] // hack for Trafalgar
                  forecast.areas[place[i]] = areaforecast
                }
                place = null
              }
              break
            case "h2":
              if (!forecast.synopsis) {
                forecast.synopsis = {}
                forecast.synopsis.time = text.substr(text.length - 4)
                place = "SYNOPSIS"
              }
              break
            case "h3":
              place = text.split(',')
              break
          }
        }
      })
      parser.write(b)
      callback(forecast)
    })
  }
}

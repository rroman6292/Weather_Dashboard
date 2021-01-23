var city = "";
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentWindSpeed = $("#wind-speed");
var currentUvIndex = $("#uv-index");
var sCity = [];

function find (city) {
    for (var i = 0; i < sCity.length; i++) {
        if(city.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
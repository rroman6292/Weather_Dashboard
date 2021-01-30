var APIKey = "5809c9e7ade10f5aacfb02fa2f2351fc";
var lastCitySearched;
var storedCities;
var cities = [];

if (localStorage.getItem("cities")) {
	storedCities = JSON.parse(localStorage.getItem("cities"));
	console.log(storedCities);
	for (var i = 0; i < storedCities.length; i++) {
		lastCitySearched = storedCities.length - 1;
		var lastCity = storedCities[lastCitySearched];
	}
} else {
	cities;
}
renderLastCityInfo();
console.log("cities", cities);

$("#search-city").on("click", function (event) {
	event.preventDefault();
	var city = $("#city-input").val();
	console.log(city);

	var queryURL1 =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		city +
		"&appid=" +
		APIKey;

	$.ajax({
		url: queryURL1,
		method: "GET",
	}).then(function (response) {
		console.log(response);
		lat = response.coord.lat;
		lon = response.coord.lon;

		
		cities.push(city);
		
		localStorage.setItem("cities", JSON.stringify(cities));

		var cityEl = $("<li>");
		cityEl.addClass("list-group-item city-item");
		cityEl.text(response.name);
		cityEl.attr("lat", response.coord.lat);
		cityEl.attr("lon", response.coord.lon);
		$("#city-list").prepend(cityEl);

		
		cityEl.on("click", function () {
			lat = $(this).attr("lat");
			lon = $(this).attr("lon");
			renderCityName(response);
			renderCityInfo(lat, lon);
		});
		renderCityName(response);
		renderCityInfo(lat, lon);
	});
});

function renderLastCityInfo() {
	$("#city-list").clear;
	var queryURL1 =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		lastCity +
		"&appid=" +
		APIKey;

	$.ajax({
		url: queryURL1,
		method: "GET",
	}).then(function (response) {
		console.log(response);
		lat = response.coord.lat;
		lon = response.coord.lon;

		renderCityName(response);
		renderCityInfo(lat, lon);
	});
}

function renderCityName(response) {
	
	var currentDate = moment().format("L");
	
	$(".card-title").text(`${response.name} (${currentDate})`);
	var weatherIcon = $("<img>");
	var iconCode = response.weather[0].icon;
	var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
	weatherIcon.attr("src", iconUrl);
	$(".card-title").append(weatherIcon);
}


function renderCityInfo(lat, lon) {
	var queryURL2 =
		"https://api.openweathermap.org/data/2.5/onecall?lat=" +
		lat +
		"&lon=" +
		lon +
		"&units=imperial&appid=" +
		APIKey;

	$.ajax({
		url: queryURL2,
		method: "GET",
	}).then(function (response) {
		
		$("#temperature").text(`Temperature: ${response.current.temp} \xB0F`);
		$("#humidity").text(`Humidity: ${response.current.humidity}%`);
		$("#wind-speed").text(`Wind Speed: ${response.current.wind_speed} MPH`);
		$("#uv-index").text(`UV Index: `);

		
		var uviSpan = $("<span>");
		uviSpan.text(`${response.current.uvi}`);
		
		var uvi = response.current.uvi;
		if (uvi <= 2) {
			uviSpan.addClass("badge badge-success");
			uviSpan.css("background-color", "orange")
			uviSpan.css("color", "black");
		} else if (uvi <= 5) {
			uviSpan.addClass("badge badge-warning");
			uviSpan.css("background-color", "orange")
			uviSpan.css("color", "black");
		} else if (uvi <= 7) {
			uviSpan.addClass("badge");
			uviSpan.css("background-color", "orange");
			uviSpan.css("color", "black");
		} else if (uvi <= 9) {
			uviSpan.addClass("badge badge-danger");
			uviSpan.css("background-color", "red")
			uviSpan.css("color", "black");
		} else {
			uviSpan.addClass("badge");
			uviSpan.css("background-color", "purple");
			uviSpan.css("color", "black");
		}
		$("#uv-index").append(uviSpan);

		
		renderForecast(response);
	});
}

function renderForecast(response) {
	$("#forecast").empty();
	var days = response.daily;
	days.slice(1, 6).map((day) => {
		var dayCard = $("<div>");
		dayCard.addClass("card col-md-4 daycard");
		dayCard.css("background-color", "#a4c0e2");
		dayCard.css("margin-right", "5px");
		dayCard.css("font-size", "15px");

		var dayCardBody = $("<div>");
		dayCardBody.addClass("card-body");
		dayCard.append(dayCardBody);

		var dayCardName = $("<h6>");
		dayCardName.addClass("card-title");
		var datestamp = moment.unix(day.dt);
		var forecastDate = datestamp.format("L");
		dayCardName.text(forecastDate);
		dayCardBody.append(dayCardName);

		
		var weatherIcon = $("<img>");
		var iconCode = day.weather[0].icon;
		var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
		weatherIcon.attr("src", iconUrl);
		dayCardBody.append(weatherIcon);

		var dayTemp = $("<p>");
		dayTemp.text(`Temp: ${day.temp.max} \xB0F`);
		dayCardBody.append(dayTemp);

		var dayHumidity = $("<p>");
		dayHumidity.text(`Humidity: ${day.humidity}%`);
		dayCardBody.append(dayHumidity);

		$("#forecast").append(dayCard);
	});
}
//Input city name
//When you click search it fetches info from weather api for today and 5 day forecast
//Need temp, wind speed and humidity in metric
//Save cities in localStorage(no duplicates)
//clear search history button

const APIKey = "f6ee3f8c94bcae7762b1401c6e6758d1";

const searchBtn = $('#search-button');
const searchInput = $('#search-input');

//Press submit button and fetch data based on searchinput and show it on the screen

//need function to fetch data
//need function to show said data

searchBtn.on('click', function (e) {
    e.preventDefault();

    fetchData("London");
    //showData();
})

function fetchData(city) {
    //get the long and lat using geolocation API
    const geoQueryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`
    fetch(geoQueryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            //use that lat and lon to find the city and fetch that data
            const queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`
            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    //grab weather icon,temp,wind and humidity
                    const weather = {
                    icon : data.weather.icon,
                    temp : data.main.temp,
                    wind : data.win.speed,
                    humidity : data.main.humidity
                    }
                    return weather;
                })
        })
}

function showData(weather) {
    //create element in which to store all data
    const divEl = $('<div>');
    //create element for temp
    const temp
    //create element for wind
    //create element for humidity
    //create element for icon
}
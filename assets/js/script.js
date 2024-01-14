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
    fetchData("London").then((w) => {
        showData(w);
    });
})

function fetchData(city) {
    //get the long and lat using geolocation API
    const geoQueryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`
    return fetch(geoQueryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            //use that lat and lon to find the city and fetch that data
            const queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`
            return fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    //grab weather icon,temp,wind and humidity
                    const weather = {
                        name: data.name,
                        icon: data.weather[0].icon,
                        temp: data.main.temp,
                        wind: data.wind.speed,
                        humidity: data.main.humidity
                    }
                    console.log(weather);
                    return weather;
                })
        })
        
}

function showData(weather) {
    //create element in which to store all data
    const divEl = $('<div>');
    //create element for temp
    const temp = $('<p>').text(`${weather.temp} °C`);
    //create element for wind
    const wind = $('<p>').text(`${weather.wind} Kmh`);
    //create element for humidity
    const humidity = $('<p>').text(`${weather.humidity} %`);
    //create element for icon
    const icon = $('<img>').attr('src', `https://openweathermap.org/img/wn/${weather.icon}.png`);
    //create element for city name
    const cityName = $('<h3>').text(weather.name);

    //append all elements to the div
    divEl.append(cityName, temp, icon, wind, humidity);
    $('body').append(divEl);
}
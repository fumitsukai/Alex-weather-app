//Input city name
//When you click search it fetches info from weather api for today and 5 day forecast
//Need temp, wind speed and humidity in metric
//Save cities in localStorage(no duplicates)
//clear search history button

const APIKey = "f6ee3f8c94bcae7762b1401c6e6758d1";

const searchBtn = $('#search-button');
const searchInput = $('#search-input');
const todayScn = $('#today');
const forecastScn = $('#forecast');
const historyCol = $('#history');


//Press submit button and fetch data based on searchinput and show it on the screen

//need function to fetch data
//need function to show said data
//"weather" for current and "forecast" for the 5 day forecast
//i could use the forecast API only but it's not giving me the current time it's always in the future

searchBtn.on('click', function (e) {
    $('section').children().remove();
    e.preventDefault();
    fetchData(searchInput.val(), "weather").then((w) => {
        showData(w, todayScn);
    });
    fetchData(searchInput.val(), "forecast").then((w) => {
        for (let i = 0; i < w.length; i++) {
            showData(w[i], forecastScn);
        }
    });
    saveSearch(searchInput.val().trim());
    searchHistory();
})

function fetchData(city, forecast) {
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
            const queryURL = `https://api.openweathermap.org/data/2.5/${forecast}?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`
            //check what forecast we are checking current or 5day to display the correct data
            if (forecast === "weather") {
                return fetch(queryURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        //grab weather icon,temp,wind and humidity
                        const weather = {
                            name: data.name,
                            date: data.dt,
                            icon: data.weather[0].icon,
                            temp: data.main.temp,
                            wind: data.wind.speed,
                            humidity: data.main.humidity
                        }
                        return weather;
                    })
            } else {
                return fetch(queryURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        const weatherArr = [];
                        //grab weather icon,temp,wind and humidity 
                        //we are getting 40 items in the api array so we will need to start at index 7 which is 24h after and go up by 8
                        for (let i = 7; i < data.list.length; i += 8) {
                            const weather = {
                                date: data.list[i].dt,
                                icon: data.list[i].weather[0].icon,
                                temp: data.list[i].main.temp,
                                wind: data.list[i].wind.speed,
                                humidity: data.list[i].main.humidity
                            }
                            weatherArr.push(weather);
                        }
                        return weatherArr;
                    })
            }
        })

}

function showData(weather, forecast) {
    //create element in which to store all data
    const divEl = $('<div>');
    //create element for temp
    const temp = $('<p>').text(`Temp: ${weather.temp} °C`);
    //create element for wind
    const wind = $('<p>').text(`Wind: ${weather.wind} Kmh`);
    //create element for humidity
    const humidity = $('<p>').text(`Humidity: ${weather.humidity} %`);
    //create element for icon
    const icon = $('<img>').attr('src', `https://openweathermap.org/img/wn/${weather.icon}.png`);
    //create element for city name
    const cityName = $('<h3>').text(weather.name);
    //create date variable
    const date = $('<p>').text(dayjs.unix(weather.date).format('DD-MM-YYYY'));
    //append all elements to the div
    divEl.append(cityName, date, icon, temp, wind, humidity);
    //append the div based on what we need current or forecast
    forecast.append(divEl);
}

//function to save search input to localstorage

function saveSearch(input) {
    const searchHistory = JSON.parse(localStorage.getItem('search')) || [];
    if (!searchHistory.includes(input) && input != null) {
        searchHistory.push(input);
    }
    localStorage.setItem('search', JSON.stringify(searchHistory));
    return searchHistory;
}

//function to create buttons for the search history
function searchHistory() {
    //remove white spaces in case someone has clicked on the search button by mistake
    const storageData = saveSearch().filter(e => e.trim() != '');
    //empty the buttons area so we dont have duplicates
    historyCol.empty();
    for (data in storageData) {
        //create buttons
        const search = $('<button>').text(storageData[data]).addClass('searchbtn');
        historyCol.append(search);
    }
}

//event to fetch and show data once we click on one of the search history buttons
historyCol.on('click', '.searchbtn', function (e) {
    e.preventDefault();
    $('section').children().remove();
    fetchData($(this).text(), "weather").then((w) => {
        showData(w, todayScn);
    });
    fetchData($(this).text(), "forecast").then((w) => {
        for (let i = 0; i < w.length; i++) {
            showData(w[i], forecastScn);
        }
    });
})

//clear local storage on page load

window.onload = window.localStorage.clear();
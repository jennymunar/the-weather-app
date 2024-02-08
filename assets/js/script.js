// Selectors to display the weat information
let city= '';
const searchCity= $('#city-input');
const searchBtn= $('#search-btn');
const currentCity= $('#current-city');
const currentTemperature= $('#temperature');
const currentHumidity= $('#humidity');
const currentWind= $('#wind');
let sCity= [];

// API key generated by Open Weather
const apiKey = "8b361aab4b4e29dae3d8411b079c43d1";

// function for current weather
function displayWeather (event) {
    event.preventDefault();
    if (searchCity.val().trim() !== '') {
        const cityId = searchCity.val().trim(); 
        currentWeather(cityId); 
    }
}

//This will search for the  current weather conditions. Then the AJAX call will get the data
function currentWeather(cityid) {
    const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityid + "&APPID=" + apiKey;
        $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function(response) {
        console.log(response)
        
        const cityId = response.id;
        console.log("City ID:", cityId);

        const weatherIcon = response.weather[0].icon;
        const iconurl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
        const date = new Date (response.dt * 1000).toLocaleDateString();
        // To display temperature, humidity, wind speed
        $(currentCity).html(response.name + ' ' + '(' + date + ')' + '<img src=' + iconurl + '>');
        const tempF = (response.main.temp - 273.15) * 1.80 + 32;
        
        $(currentTemperature).html(' ' + (tempF).toFixed(2) + ' ' + '&#8457');
        $(currentHumidity).html(' ' + response.main.humidity + ' ' + '%');

        const ws = response.wind.speed;
        const windsmph = (ws * 2.237).toFixed(1);
        $(currentWind).html(' ' + windsmph + ' ' + 'mph');

        forecast (cityId);
        if (response.cod ==200) {
            sCity = JSON.parse(localStorage.getItem('cityName'));
            console.log(sCity);
            if (sCity == null) {
                sCity = [];
                localStorage.setItem('cityName', JSON.stringify(sCity));
            }
            addToList(city); 
        }
    });
}    

function addToList(city) {
    sCity.push(city);
    localStorage.setItem('cityName', JSON.stringify(sCity));
}

// Current weather in DOM element 
function forecast(cityid) {
    console.log("Forecast for City ID:", cityid); 
    const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + apiKey;
    $.ajax({
        url: forecastURL, 
        method: "GET"
    })
    .then(function (response) {
               if (response && response.list && response.list.length > 0) {
            for (let i = 0; i < 5; i++) {
                const dataIndex = (i * 8);
                if (response.list[dataIndex]) {
                    const date = new Date(response.list[dataIndex].dt * 1000).toLocaleDateString();
                    const iconcode = response.list[dataIndex].weather[0].icon;
                    const iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
                    const tempK = response.list[dataIndex].main.temp;
                    const tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
                    const humidity = response.list[dataIndex].main.humidity;
                    const windsmph = response.list[dataIndex].wind.speed;

                    $('#date' + i).html(date); 
                    $('#img' + i).html('<img src="' + iconurl + '">');
                    $('#temp' + i).html(' ' + tempF + '&#8457');
                    $('#humidity' + i).html(' ' + humidity + '%');
                    $('#wind-speed' + i).html(' ' + windsmph + 'mph');
                } 
            }
        } 
    })
}
       

// Search btn
$('#search-btn').on('click', displayWeather);


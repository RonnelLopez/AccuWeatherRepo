document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "hjxf9u0ZGJX1fJNQy6Miu65m1MCDrC6v"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetch5DailyData(locationKey);
                    fetchHourlyForecastData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
        
    }

    function fetchHourlyForecastData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecasts(data);
                } else {
                    weatherDiv.innerHTML += `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function fetch5DailyData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecasts(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML = `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching daily forecast data.</p>`;
            });
    }

    
    
    


//display Function

function displayWeather(data) {
    const temperature = data.Temperature.Metric.Value;
    const weather = data.WeatherText;
    const weatherContent = `
        <h2>Weather</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Weather: ${weather}</p>
    `;
    weatherDiv.innerHTML = weatherContent;
}

function displayHourlyForecasts(hourlyForecasts) {
    let hourlyForecastContent = '<h2>Hourly Forecast</h2>';

    hourlyForecasts.forEach(forecast => {
        const dateTime = new Date(forecast.DateTime);
        const temperature = forecast.Temperature.Value;
        const weather = forecast.IconPhrase;

        hourlyForecastContent += `
            <div>
                <p>Time: ${dateTime.toLocaleTimeString()}</p>
                <p>Temperature: ${temperature}°C</p>
                <p>Weather: ${weather}</p>
            </div>
        `;
    });

    weatherDiv.innerHTML += hourlyForecastContent;
}

function displayDailyForecasts(dailyForecasts) {
    let dailyForecastContent = '<h2>5-Day Daily Forecast</h2>';

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.Date);
        const temperatureMin = forecast.Temperature.Minimum.Value;
        const temperatureMax = forecast.Temperature.Maximum.Value;
        const dayWeather = forecast.Day.IconPhrase;
        const nightWeather = forecast.Night.IconPhrase;

        dailyForecastContent += `
            <div>
                <p>Date: ${date.toDateString()}</p>
                <p>Min Temperature: ${temperatureMin}°C</p>
                <p>Max Temperature: ${temperatureMax}°C</p>
                <p>Day Weather: ${dayWeather}</p>
                <p>Night Weather: ${nightWeather}</p>
            </div>
        `;
    });

    weatherDiv.innerHTML += dailyForecastContent;
}
 
    
    
    
});

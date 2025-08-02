function getWeather() {
    const apiKey = '171193f4b9469dc10668c57b60cd0fa9';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data); 
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const feelsLike = Math.round(data.main.feels_like - 273.15);
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        tempDivInfo.innerHTML = `
            <p>${temperature}°C</p>
            <p>Feels like: ${feelsLike}°C</p>
        `;

        weatherInfoDiv.innerHTML = `
            <p><strong>${cityName}</strong></p>
            <p>${description}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;

        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        showImage();

        console.log("Weather description:", description);
        console.log("Temperature:", temperature + "°C");

        updateBackgroundFromTemperature(temperature); 
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    hourlyForecastDiv.innerHTML = '';

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function updateBackgroundFromTemperature(tempCelsius) {
    const body = document.body;
    let bgUrl = "";

    if (tempCelsius <= 0) {
        bgUrl = "images/snow.avif"; // Freezing - Snow likely
    } else if (tempCelsius > 0 && tempCelsius <= 10) {
        bgUrl = "images/cloud.avif"; // Very cold - Likely cloudy
    } else if (tempCelsius > 10 && tempCelsius <= 20) {
        bgUrl = "images/rain.avif"; // Cool - May have rain
    } else if (tempCelsius > 20 && tempCelsius <= 30) {
        bgUrl = "images/clear.avif"; // Pleasant - Clear weather
    } else if (tempCelsius > 30 && tempCelsius <= 40) {
        bgUrl = "images/sunny.avif"; // Hot - Sunny
    } else if (tempCelsius > 40) {
        bgUrl = "images/storm.avif"; // Extreme heat - Possible storm/haze
    } else {
        bgUrl = "images/default.avif"; // Default fallback
    }

    body.style.backgroundImage = `url('${bgUrl}')`;
}


function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}

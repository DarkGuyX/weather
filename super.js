document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '7b7e6fd8d7504880a33111215252706';
    let defaultCity = 'London';
    
    // Elements
    const citySearch = document.getElementById('city-search');
    const searchBtn = document.getElementById('search-btn');
    const cityName = document.getElementById('city-name');
    const currentTemp = document.getElementById('current-temp');
    const weatherIcon = document.getElementById('weather-icon');
    const forecastDays = document.getElementById('forecast-days');
    
    // Fetch weather data
    async function fetchWeatherData(city) {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=14&aqi=no&alerts=no`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Error: ' + error.message);
            return null;
        }
    }
    
    // Display current weather
    function displayCurrentWeather(data) {
        cityName.textContent = `${data.location.name}, ${data.location.country}`;
        currentTemp.textContent = Math.round(data.current.temp_c);
        weatherIcon.src = `https:${data.current.condition.icon}`;
        weatherIcon.alt = data.current.condition.text;
        
        // Weather details
        document.getElementById('feels-like').textContent = `${Math.round(data.current.feelslike_c)}°C`;
        document.getElementById('humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('wind').textContent = `${Math.round(data.current.wind_kph)} km/h`;
        document.getElementById('pressure').textContent = `${data.current.pressure_mb} mb`;
        
        // Date
        const date = new Date(data.location.localtime);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = date.toLocaleDateString('uk-UA', options);
    }
    
    // Display forecast
    function displayForecast(data) {
        forecastDays.innerHTML = '';
        
        data.forecast.forecastday.forEach(day => {
            const forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day';
            
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            forecastDay.innerHTML = `
                <h4>${dayName}</h4>
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                <div class="temp">
                    <span class="max-temp">${Math.round(day.day.maxtemp_c)}°</span>
                    <span class="min-temp">${Math.round(day.day.mintemp_c)}°</span>
                </div>
            `;
            
            forecastDays.appendChild(forecastDay);
        });
    }
    
    // Update weather
    async function updateWeather(city) {
        const data = await fetchWeatherData(city);
        if (data) {
            displayCurrentWeather(data);
            displayForecast(data);
            citySearch.value = city;
        }
    }
    
    // Event listeners
    searchBtn.addEventListener('click', () => {
        const city = citySearch.value.trim();
        if (city) {
            updateWeather(city);
        }
    });
    
    citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = citySearch.value.trim();
            if (city) {
                updateWeather(city);
            }
        }
    });
    
    // Initialize with default city
    updateWeather(defaultCity);
});
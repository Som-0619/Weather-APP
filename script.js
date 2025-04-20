const apiKey = 'b08a35a055ee4d8e9f854619251904';
let lastSpokenText = '';

async function getWeather() {
  const city = document.getElementById('city-input').value;
  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  const currentRes = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`);
  const currentData = await currentRes.json();

  const container = document.querySelector('.weather-container');
  const weatherDetails = document.getElementById('weather-details');
  const extraMetrics = document.getElementById('extra-metrics');

  const condition = currentData.current.condition.text.toLowerCase();
  const isDay = currentData.current.is_day;

  // Animate details
  weatherDetails.style.opacity = 0;
  extraMetrics.style.opacity = 0;

  weatherDetails.innerHTML = `
    <h2>${currentData.location.name}, ${currentData.location.country}</h2>
    <img src="https:${currentData.current.condition.icon}" alt="weather icon">
    <p>Temperature: ${currentData.current.temp_c}°C</p>
    <p>Condition: ${currentData.current.condition.text}</p>
  `;

  extraMetrics.innerHTML = `
    <div><strong>UV Index:</strong><br>${currentData.current.uv}</div>
    <div><strong>Humidity:</strong><br>${currentData.current.humidity}%</div>
    <div><strong>Wind:</strong><br>${currentData.current.wind_kph} km/h</div>
  `;

  lastSpokenText = `The weather in ${currentData.location.name} is ${currentData.current.condition.text} with a temperature of ${currentData.current.temp_c} degrees Celsius. The humidity is ${currentData.current.humidity} percent and wind speed is ${currentData.current.wind_kph} kilometers per hour.`;

  setTimeout(() => {
    weatherDetails.style.opacity = 1;
    weatherDetails.style.transition = "opacity 1s";
    extraMetrics.style.opacity = 1;
    extraMetrics.style.transition = "opacity 1s";
  }, 100);

  container.className = 'weather-container';
  if (isDay === 0) {
    container.classList.add('night');
  } else if (condition.includes('sunny')) {
    container.classList.add('sunny');
  } else if (condition.includes('cloudy') || condition.includes('overcast')) {
    container.classList.add('cloudy');
  } else if (condition.includes('rain') || condition.includes('drizzle')) {
    container.classList.add('rainy');
  } else if (condition.includes('storm') || condition.includes('thunder')) {
    container.classList.add('stormy');
  } else {
    container.classList.add('sunny');
  }

  document.body.style.background = 'linear-gradient(135deg, #1b2735, #090a0f)';
}

function speakWeather() {
  if ('speechSynthesis' in window && lastSpokenText) {
    const msg = new SpeechSynthesisUtterance(lastSpokenText);
    window.speechSynthesis.speak(msg);
  } else {
    alert('Sorry, your browser does not support speech synthesis.');
  }
}

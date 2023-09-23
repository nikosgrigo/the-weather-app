const API_KEY = "a6d9a688627f4387a5b81327232309";
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

const getSearchInput = function () {
  //pairnv katharizo to input kai to bazv sto url
};

const LOCATION = "athens";
const AQI = "no";

async function fetchWeatherData() {
  const url = `${BASE_URL}?key=${API_KEY}&q=${LOCATION}&aqi=${AQI}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }

    const data = await response.json();

    if (data) {
      const { location, current } = data;
      const weather = {
        //General Info
        location: location.name,
        temperature: current.temp_c,
        date: location.localtime,
        condition: current.condition.text,
        icon: current.condition.icon,

        //Extra Info for the rigth section
        windPerKlm: current.wind_kph,
        humidity: current.humidity,
        cloudy: current.cloud,
      };

      renderHtml(weather);

      console.log(weather);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchWeatherData();
const renderHtml = function (weather) {
  let parentElement = document.querySelector(".main_section");
  // parentElement.innerHTML = "";

  let htmlMarkup = ` <div class="container">
  <span class="temperature_span">${weather.temperature}&deg;</span>
  <div class="general_info">
    <div class="location">${weather.location}</div>
    <div class="date">${weather.date}</div>
  </div>
  <div class="weather_info">
  <i class="bi bi-cloud-rain weather_img"></i>

    <span class="weather_short_description">${weather.condition}</span>
  </div>
</div>`;

  /*   <img class='weather_img' src='${weather.icon}'> */

  parentElement.insertAdjacentHTML("afterbegin", htmlMarkup);

  htmlMarkup = `<h2>Weather details</h2>
  <span class="cloudy">Cloudy: ${weather.cloudy}% </span>
  <span class="wind">Wind : ${weather.windPerKlm}km/h</span>
  <span class="humidity">Humidity: ${weather.humidity}%</span>`;

  parentElement = document.querySelector(".weather_details");
  parentElement.insertAdjacentHTML("afterbegin", htmlMarkup);
};

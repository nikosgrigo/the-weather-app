const API_KEY = "a6d9a688627f4387a5b81327232309";
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

const search_btn = document.querySelector(".search_btn");
const location_input_El = document.querySelector("#input");
const error_message_El = document.querySelector(".error_message");

const main_section = document.querySelector(".main_section");
const weather_details = document.querySelector(".weather_details");

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position.coords.latitude, position.coords.longitude);

    const coord1 = Number(position.coords.latitude).toFixed(3);
    const coord2 = Number(position.coords.longitude).toFixed(3);
    const location = `${coord1},${coord2}`;
    // console.log(location);

    fetchWeatherData(location);
  });
} else {
  console.log("Coudn't get your location");
}

const displayErrorMessage = function () {
  error_message_El.classList.add("show");
  setTimeout(() => {
    error_message_El.classList.remove("show");
  }, 5000);
};

const getLocationFromSearchBar = function () {
  let location_value = location_input_El.value.toLowerCase().trim();

  if (location_value) {
    fetchWeatherData(location_value);
    location_input_El.value = "";
    // displaySuccessMessage();
  } else {
    // displayErrorMessage();
  }
};

search_btn.addEventListener("click", getLocationFromSearchBar);
location_input_El.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    search_btn.click();
  }
});

const formatDateAndDisplay = function (date) {
  date ? (date = new Date(date)) : (date = new Date());

  const options = {
    weekday: "long",
    // year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleString("en-US", options);
};

async function fetchWeatherData(location) {
  renderSpinner();

  const url = `${BASE_URL}?key=${API_KEY}&q=${location}`;
  // console.log(url);
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
        wind_direction: current.wind_dir,
        humidity: current.humidity,
        cloudy: current.cloud,
        region: location.region,
      };

      renderHtml(weather);

      console.log(weather);
    }
  } catch (error) {
    console.error("Error:", error);
    displayErrorMessage();
  }
}

const renderHtml = function (weather) {
  clearParentElement(main_section);

  let htmlMarkup = ` <div class="container">
  <span class="temperature_span">${weather.temperature}&deg;</span>
  <div class="general_info">
    <div class="location">${weather.location}</div>
    <div class="date">${formatDateAndDisplay(weather.date)}</div>
  </div>
  <div class="weather_info">
   <img class='weather_img' src='${weather.icon}'> 
    <span class="weather_short_description">${weather.condition}</span>
  </div>
</div>`;

  main_section.insertAdjacentHTML("afterbegin", htmlMarkup);

  htmlMarkup = `  <h2>Weather details</h2>
  <div class="weather_details_div">Cloudy: <span>${weather.cloudy}% </span></div>
  <div class="weather_details_div">Wind: <span>${weather.windPerKlm}km/h</span></div>

  <div class="weather_details_div">
    Wind Direction: <span>${weather.wind_direction}</span>
  </div>
  <div class="weather_details_div">Humidity: <span>${weather.humidity}%</span></div>
  <div class="weather_details_div">Region: <span>${weather.region}</span></div>`;

  clearParentElement(weather_details);
  weather_details.insertAdjacentHTML("afterbegin", htmlMarkup);
};

const renderSpinner = () => {
  const markup = `
    <div class="dot-spinner">
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
</div>`;
  clearParentElement(main_section);
  main_section.insertAdjacentHTML("afterbegin", markup);

  clearParentElement(weather_details);
  weather_details.insertAdjacentHTML("afterbegin", markup);
};

const clearParentElement = (element) => {
  element.innerHTML = "";
};

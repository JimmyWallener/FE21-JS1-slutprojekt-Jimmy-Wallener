import { getDailyData, getCurrentWeather } from './fetchData.js';

$(function () {
  // Setting up api to load at same time
  const getWeatherData = (city) => {
    Promise.all([getCurrentWeather(city), getDailyData(city)]).then((data) => {
      createWeatherCard(data[0]);
      fiveDayForecast(data[1]);
    });
  };

  // Setting a default city for cards
  getWeatherData('Stockholm, SE');

  // Clickevent for search field
  $('#search').click((e) => {
    e.preventDefault();

    // Start with capturing user search input
    const city = $('#search-field').val();
    $('#search-field').val('');

    // If the input field holds value, fetch apidata
    if (!city == '') {
      getWeatherData(city);
    }
  });
  const createWeatherCard = async (currentWeather) => {
    // Deconstructing json fields
    const {
      city_name,
      weather,
      country_code,
      rh,
      wind_spd,
      wind_cdir_full,
      lon,
      lat,
    } = currentWeather.data[0];
    initGoogleMap(lat, lon);

    // adding data to first card:
    $('#temp').text(`${Math.round(currentWeather.minutely[0].temp)}°C`);
    $('#loc').text(`${city_name}, ${country_code}`);
    $('#weather-icon').attr({
      src: `https://www.weatherbit.io/static/img/icons/${weather.icon}.png`,
      alt: `${weather.description}`,
    });
    $('#desc').text(`${weather.description}`);
    $('#wind').text(
      `Vindhastighet: ${wind_spd.toFixed(1)} m/s (${wind_cdir_full})`
    );
    $('#moist').text(`Luftfuktighet: ${rh.toFixed(1)}%`);

    $('#error-message').text('');
  };
  const fiveDayForecast = async (forecast) => {
    // Begin by removing previous <div> or it will multiply
    $('.daily').remove();
    // getting data for the next 5 days
    for (let i = 1; i <= 5; i++) {
      // Deconstructing Json-fields
      const { datetime, weather, temp } = forecast.data[i];

      $('#daily-forecast').append(`
          <div class="flex-column daily">
          <p class="text forecast fw-bold">${datetime}</p>
          <i class="fas fa-sun fa-2x mb-3"></i>
          <p class="text-muted forecast fw-bold">${Math.round(temp)} °C </p>
          <i class="fas fa-sun fa-2x mb-3"></i>
          <p class="text-muted forecast fw-bold">${weather.description}</p>
          <i class="fas fa-sun fa-2x mb-3"></i>
          <img class="small-icon" src="https://www.weatherbit.io/static/img/icons/${
            weather.icon
          }.png" width="75px" alt="${weather.description}" />
          
           `);
    }
  };
  const initGoogleMap = (lat, long) => {
    const cords = { lat: parseInt(lat), lng: parseInt(long) };
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: cords,
    });
    const marker = new google.maps.Marker({
      position: cords,
      map: map,
    });
  };
});

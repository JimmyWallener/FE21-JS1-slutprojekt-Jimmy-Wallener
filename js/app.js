import Weatherbit from './Weatherbit.js';

$(function () {
  // Setting up api to load at same time
  const getWeatherData = (city, unit) => {
    const currentUrl = 'https://api.weatherbit.io/v2.0/current';
    const dailyUrl = 'https://api.weatherbit.io/v2.0/forecast/daily';

    let currentWeather = new Weatherbit(currentUrl, city, true, unit);
    let dailyWeather = new Weatherbit(dailyUrl, city, false, unit);

    Promise.all([currentWeather.fetchApi(), dailyWeather.fetchApi()]).then(
      (data) => {
        createWeatherCard(data[0], unit);
        fiveDayForecast(data[1], unit);
      }
    );
  };
  getWeatherData('Stockholm,SE');
  // Depending on user selection on metric or imperial, function returns value based from ternary operator as object.
  const setUnit = (unit) => {
    const temp = unit === 'I' ? 'F' : unit === 'S' ? 'K' : '°C';
    const speed = unit === 'I' ? 'mph' : 'm/s';
    return {
      _temp: temp,
      _speed: speed,
    };
  };

  // Clickevent for search field
  $('#search').click((e) => {
    e.preventDefault();

    // Start with capturing user search input
    const city = $('#search-field').val();
    const unit = $('input[name="unit"]:checked').val();

    resetSearchFields();

    // If the input field holds value, fetch apidata
    if (!city == '') {
      getWeatherData(city, unit);
    }
  });

  const resetSearchFields = () => {
    $('#search-field').val('');
    $('input[name="unit"]').prop('checked', false);
  };

  const createWeatherCard = async (currentWeather, unit) => {
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
    $('#temp').text(
      `${Math.round(currentWeather.minutely[0].temp)} ${setUnit(unit)._temp}`
    );
    $('#loc').text(`${city_name}, ${country_code}`);
    $('#weather-icon').attr({
      src: `https://www.weatherbit.io/static/img/icons/${weather.icon}.png`,
      alt: `${weather.description}`,
    });
    $('#desc').text(`${weather.description}`);
    $('#wind').text(
      `Vindhastighet: ${wind_spd.toFixed(1)} ${
        setUnit(unit)._speed
      } (${wind_cdir_full})`
    );
    $('#moist').text(`Luftfuktighet: ${rh.toFixed(1)}%`);

    $('#error-message').text('');
  };

  // Creating the five day forecast cards
  const fiveDayForecast = async (forecast, unit) => {
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
          <p class="text-muted forecast fw-bold">${Math.round(temp)} ${
        setUnit(unit)._temp
      } </p>
          <i class="fas fa-sun fa-2x mb-3"></i>
          <p class="text-muted forecast fw-bold">${weather.description}</p>
          <i class="fas fa-sun fa-2x mb-3"></i>
          <img class="small-icon" src="https://www.weatherbit.io/static/img/icons/${
            weather.icon
          }.png" width="75px" alt="${weather.description}" />
          
           `);
    }
  };

  // getting map data based on lat/long from weather api, and creates a marker on said map
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

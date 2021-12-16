export const getDailyData = async (city = 'Stockholm') => {
  // getting apikey from external json file
  const { apikey } = await (await fetch('./config/config.json')).json();
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apikey}&lang=sv&days=6`;
  let response = await fetch(url);
  if (response.status != 200) {
    return response.statusText;
  } else {
    return response.json();
  }
};

export const getCurrentWeather = async (city = 'Stockholm') => {
  const { apikey } = await (await fetch('./config/config.json')).json();
  const url = `https://api.weatherbit.io/v2.0/current?city=${city}&include=minutely&key=${apikey}&lang=sv`;
  let response = await fetch(url);
  if (response.status != 200) {
    if (response.statusText === 'No Content') {
      $('#error-message').text(
        `Ingen stad med det namnet kunde hittas. : ${response.statusText}`
      );
    } else {
      $('#error-message').text(
        `Ett fel inträffade, var god försök igen: ${response.statusText}`
      );
    }
  } else {
    return response.json();
  }
};

export default {
  getDailyData,
  getCurrentWeather,
};

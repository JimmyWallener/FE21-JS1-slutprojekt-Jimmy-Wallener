export default class Weatherbit {
  constructor(url, city, isCurrent, unit) {
    this.url = url;
    this.key = '2df59a20aa8a47db9391b14b2cae4fe3';
    this.city = city;
    this.isCurrent = isCurrent ? '&include=minutely' : '&days=6';
    this.unit = unit;
  }
  async fetchApi() {
    const url = `${this.url}?city=${this.city}${this.isCurrent}&key=${this.key}&units=${this.unit}&lang=sv`;
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
  }
}

import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl =
    'https://api.data.gov.sg/v1/environment/4-day-weather-forecast?date=2025-01-12';

  constructor() {}

  getWeatherData() {
    return axios
      .get(this.apiUrl)
      .then((response) => {
        // Handle successful response
        return response.data;
      })
      .catch((error) => {
        // Handle error
        console.error('There was an error!', error);
        throw error;
      });
  }
}

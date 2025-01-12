import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private baseUrl =
    'https://api.data.gov.sg/v1/environment/4-day-weather-forecast';

  constructor() {}

  getWeatherData(date: string) {
    return axios
      .get(`${this.baseUrl}?date=${date}`)
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

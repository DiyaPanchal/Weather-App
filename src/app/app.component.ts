import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  weatherData: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService
      .getWeatherData()
      .then((data) => {
        this.weatherData = data;
        console.log(this.weatherData, 'Weather Date======='); // Display the fetched data
      })
      .catch((error) => {
        console.error('Error fetching weather data', error);
      });
  }
}

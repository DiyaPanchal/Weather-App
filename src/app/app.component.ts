import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
  ],
})
export class AppComponent implements OnInit {
  weatherData: any;
  selectedDate: Date | null = null;
  formattedDate: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today; // Use Date object directly
    this.fetchWeatherData(today); // Fetch weather data with Date object
  }

  // Open date picker function
  openDatePicker(): void {
    const dateInput = document.querySelector('input[matInput]') as HTMLElement;
    dateInput?.focus(); // Focus on the input to open the date picker
  }

  // Date change handler
  onDateChange(event: any): void {
    const selectedDate = new Date(event.value); // event.value should already be a Date object
    const formattedDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    ); // Set time to UTC midnight

    this.selectedDate = formattedDate; // Update selectedDate with the adjusted date

    console.log('selectedDate===', formattedDate);
    this.fetchWeatherData(formattedDate); // Pass the UTC date object to fetch weather data
  }

  formatDate(dateString: any): string {
    if (!dateString) return '';
    const date = new Date(dateString);

    // Get the full weekday, day, month, and year values
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    // Return the formatted date string with custom separator "|"
    return `${weekday} | ${day < 10 ? '0' + day : day} ${month} ${year}`;
  }

  // Fetch weather data
  private fetchWeatherData(date: Date): void {
    const formattedDate = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    const today = new Date();

    this.weatherService
      .getWeatherData(formattedDate) // Pass formatted date string (YYYY-MM-DD)
      .then((data) => {
        this.weatherData = data;
        const dateFromApi = data?.items[0]?.forecasts[0]?.date;

        // Explicitly parse the date string as UTC and convert it to local time
        const apiDate = today;

        // Now pass the corrected date object to the formatDate method
        this.formattedDate = this.formatDate(formattedDate); // Pass the Date object
        console.log('Weather Data:', this.weatherData);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular'; // Import Highcharts module
import * as Highcharts from 'highcharts'; // Import Highcharts library

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    HighchartsChartModule,
  ],
})
export class AppComponent implements OnInit {
  weatherData: any;
  selectedDate: Date | null = null;
  formattedDate: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  maxDate: Date = new Date(); // Initialize maxDate with current date

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today; // Use Date object directly
    this.fetchWeatherData(today); // Fetch weather data with Date object
    this.prepareChartData();
    this.setMaxDate(); // Set max date when component initializes
  }

  // Set the max date based on IST (Indian Standard Time)
  setMaxDate(): void {
    const today = new Date();
    // Convert to IST (Indian Standard Time)
    const istTime = new Date(today.getTime() + (5 * 60 + 30) * 60 * 1000);
    this.maxDate = new Date(istTime.getFullYear(), istTime.getMonth(), istTime.getDate());
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
        this.prepareChartData(data);
        this.formattedDate = this.formatDate(formattedDate);
        console.log('Weather Data:', this.weatherData);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }

  refreshPage(): void {
    window.location.reload();
  }

  prepareChartData(data?: any): void {
    console.log(data, 'chart data');
    this.chartOptions = {
      chart: {
        backgroundColor: null, // Transparent background
      },
      legend: {
        enabled: false, // Disable the legend
      },
      series: [
        {
          data: [1, 2, 3, 3, 1, 2],
          type: 'line',
          color: 'white', // Plot line in white
          dataLabels: {
            enabled: true, // Show numbers above points
            color: 'white', // Numbers in white font
            style: {
              fontSize: '10px', // Adjust font size if needed
              textOutline: 'none',
            },
            verticalAlign: 'bottom', // Position above the points
          },
        },
      ],
      title: {
        text: null, // Remove the title
      },
      xAxis: {
        visible: false, // Remove the x-axis
      },
      yAxis: {
        visible: false, // Remove the y-axis
      },
      grid: {
        enabled: false, // Ensure no grid is shown
      },
    };
  }
}

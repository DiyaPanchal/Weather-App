import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular'; // Import Highcharts module
import * as Highcharts from 'highcharts'; // Import Highcharts library
import { Inject, PLATFORM_ID } from '@angular/core';

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

  constructor(
    private weatherService: WeatherService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today; // Use Date object directly
    this.fetchWeatherData(today); // Fetch weather data with Date object
    this.prepareChartData();

    this.initializeChart();
  }

  // Open date picker function
  openDatePicker(): void {
    const dateInput = document.querySelector('input[matInput]') as HTMLElement;
    dateInput?.focus(); // Focus on the input to open the date picker
  }

  // private fetchWeatherData30(): void {
  //   this.weatherService
  //     .fetch30DaysHumidity() // Fetch the 30-day humidity data
  //     .then((data) => {
  //       this.weatherData = data;
  //       console.log('Weather Data:', this.weatherData);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching weather data:', error);
  //     });
  // }

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

  prepareChartData(): void {
    this.weatherService
      .fetch30DaysHumidity()
      .then((data) => {
        console.log('Fetched Data:', data); // Debug API response

        const humidityData = data.map((item: any) => {
          if (item.humidity && typeof item.humidity.low === 'number') {
            return item.humidity.low;
          } else {
            console.warn('Invalid item structure:', item);
            return 0; // Default value
          }
        });

        console.log('Processed Humidity Data:', humidityData); // Debug processed data

        // Update chart options reactively
        this.chartOptions = {
          chart: {
            backgroundColor: null,
          },
          legend: {
            enabled: false,
          },
          series: [
            {
              name: 'Humidity',
              data: humidityData,
              type: 'line',
              color: 'white',
              dataLabels: {
                enabled: true,
                color: 'white',
                style: {
                  fontSize: '10px',
                  textOutline: 'none',
                },
                verticalAlign: 'bottom',
              },
            },
          ],
          title: {
            text: null,
          },
        };
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }

  initializeChart(): void {
    this.chartOptions = {
      chart: {
        backgroundColor: null,
      },
      series: [
        {
          name: 'Humidity',
          data: [60, 55, 70], // Sample data
          type: 'line',
          color: 'white',
        },
      ],
      title: {
        text: '30-Day Humidity Levels',
      },
    };
  }
}

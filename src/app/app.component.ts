import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { WeatherService } from './weather.service';
import { isPlatformBrowser } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular'; // Import Highcharts module
import * as Highcharts from 'highcharts'; // Import Highcharts library
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    HighchartsChartModule,
    AgGridAngular,
  ],
})
export class AppComponent implements OnInit {
  weatherData: any;
  selectedDate: Date | null = null;
  formattedDate: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  rowData = [
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  ];

  colDefs: ColDef[] = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price' },
    { field: 'electric' },
  ];

  constructor(
    private weatherService: WeatherService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today;
    this.fetchWeatherData(today);
    this.prepareChartData();
    this.initializeChart();
  }

  openDatePicker(): void {
    if (isPlatformBrowser(this.platformId)) {
      const dateInput = document.querySelector(
        'input[matInput]'
      ) as HTMLElement;
      dateInput?.focus();
    }
  }

  onDateChange(event: any): void {
    const selectedDate = new Date(event.value);
    const formattedDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    );
    this.selectedDate = formattedDate;
    this.fetchWeatherData(formattedDate);
  }

  formatDate(dateString: any): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${weekday} | ${day < 10 ? '0' + day : day} ${month} ${year}`;
  }

  private fetchWeatherData(date: Date): void {
    const formattedDate = date.toISOString().split('T')[0];
    this.weatherService
      .getWeatherData(formattedDate)
      .then((data) => {
        this.weatherData = data;
        this.formattedDate = this.formatDate(formattedDate);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }

  refreshPage(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload();
    }
  }

  prepareChartData(): void {
    this.weatherService
      .fetch30DaysHumidity()
      .then((data) => {
        const humidityData = data.map((item: any) => {
          if (item.humidity && typeof item.humidity.low === 'number') {
            return item.humidity.low;
          } else {
            console.warn('Invalid item structure:', item);
            return 0;
          }
        });

        this.chartOptions = {
          chart: { backgroundColor: null },
          legend: { enabled: false },
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
          title: { text: null },
        };
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }

  initializeChart(): void {
    this.chartOptions = {
      chart: { backgroundColor: null },
      series: [
        {
          name: 'Humidity',
          data: [60, 55, 70],
          type: 'line',
          color: 'white',
        },
      ],
      title: { text: '30-Day Humidity Levels' },
    };
  }
}

import { Chart } from 'chart.js';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html'
})
export class StatisticPage {

    @ViewChild('barCanvas') barCanvas;

    barChart: any;

  constructor() {

  }

    ionViewDidLoad() {
        Chart.defaults.global.defaultFontColor = '#fff';
        this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT"],
                datasets: [{
                    data: [0, 10, 17, 34, 29, 20],
                    fill: false,
                    borderColor: '#fff',
                    borderWidth: 3,
                    lineTension: 0,
                    radius: 5,
                    pointBackgroundColor: '#fff',
                    title: [0, 10, 17, 34, 29, 20]
                }]
            },
            options: {
                scales: {
                    yAxes: [{ // titles axes
                        ticks: {
                            stepSize: 10,
                            beginAtZero:true,
                            padding: 20
                        },
                        gridLines: {
                            color: '#606A78',
                            lineWidth: 1,
                            drawBorder: false
                        }
                    }],
                    xAxes: [{ // titles axes
                        ticks: {
                            padding: 20
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                },
                legend:{
                    display:false,
                }
            }

        });

    }

}

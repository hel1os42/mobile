import { Chart } from 'chart.js';
import { Component, ViewChild } from '@angular/core';
var array_gradient = [];

@Component({
  selector: 'page-statistic1',
  templateUrl: 'statistic1.html'
})

export class Statistic1Page {

    @ViewChild('barCanvas') barCanvas;

    barChart: any;

    constructor() {
    }

    ionViewDidLoad() {
        Chart.defaults.global.defaultFontColor = '#fff';
        this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'bar',
            data: {
                labels: [['PERIOD 1', '01/07/2017'], ['PERIOD 2', '01/07/2017']],
                datasets: [{
                    data: [435, 335],
                    borderColor: '#FF640C',
                    backgroundColor: '#FF640C'
                }]
            },
            options: {
                scales: {
                    yAxes: [{ // titles axes
                        ticks: {
                            stepSize: 100,
                            beginAtZero:true,
                            padding: 20,
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
                },
                tooltips: {
                    callbacks: {
                        title: function(tooltipItem, data) {
                            return data['labels'][tooltipItem[0]['index']];
                        },
                        label: function(tooltipItem, data) {
                            return data['datasets'][0]['data'][tooltipItem['index']];
                        },
                        afterLabel: function(tooltipItem, data) {
                            var dataset = data['datasets'][0];
                            var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][0]['total']) * 100)
                            return '(' + percent + '%)';
                        }
                    },
                    mode: 'point',
                    backgroundColor: '#FFF',
                    titleFontSize: 16,
                    titleFontColor: '#0066ff',
                    bodyFontColor: '#000',
                    bodyFontSize: 14,
                    displayColors: false
                }
            }

        });

    }

}

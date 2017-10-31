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
                            padding: 10
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                },
                legend:{
                    display:false,
                },
                responsive: true,
                animation: {
                    onComplete: function () {
                        var ctx = this.chart.ctx;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "bottom";
                        var chart = this;
                        var datasets = this.config.data.datasets;

                        datasets.forEach(function (dataset: Array<any>, i: number) {
                            ctx.font = "8vw OpenSansNauSemibold";
                            ctx.fillStyle = "White";
                            chart.getDatasetMeta(i).data.forEach(function (p: any, j: any) {
                                ctx.fillText(datasets[i].data[j], p._model.x, p._model.y );
                            });
                        });
                    }
                }
            }

        });

    }

}

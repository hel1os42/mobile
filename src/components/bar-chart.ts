import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'bar-chart',
    template: `<canvas #barCanvas height="300"></canvas>`,
})

// this component is not used

export class BarChartComponent {

    @ViewChild('barCanvas') barCanvas: ElementRef;
    @Input() labels: string[];
    @Input() data: string[];
    barChart: any;

    constructor() {
    }

    ngAfterViewInit() {
        Chart.defaults.global.defaultFontColor = '#fff';
        this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'bar',
            data: {
                labels: this.labels,
                datasets: [{
                    data: this.data,
                    borderColor: '#FF640C',
                    backgroundColor: '#FF640C'
                }]
            },
            options: {
                scales: {
                    yAxes: [{ // titles axes
                        ticks: {
                            stepSize: 100,
                            beginAtZero: true,
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
                legend: {
                    display: false,
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
                                ctx.fillText(datasets[i].data[j], p._model.x, p._model.y);
                            });
                        });
                    }
                }
            }

        });

    }

}
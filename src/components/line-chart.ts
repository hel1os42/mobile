import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
// var array_gradient = [];

@Component({
    selector: 'line-chart',
    template: '<canvas #barCanvas height="300"></canvas>',
})

// this component is not used

export class LineChartComponent {

    @ViewChild('barCanvas') barCanvas: ElementRef;
    @Input() labels: string[];
    @Input() data: string[];
    barChart: any;

    constructor() {
    }

    ngAfterViewInit() {
        // /**
        //  * GradientArray • Steps gradient.
        //  * @author Siamak Mokhtari <hi@siamak.work>
        //  * @date 06/21/16.
        //  */
        // class GradientArray {
        //     // Convert a hex color to an RGB array e.g. [r,g,b]
        //     // Accepts the following formats: FFF, FFFFFF, #FFF, #FFFFFF
        //     hexToRgb(hex) {
        //         let r, g, b, parts;
        //         // Remove the hash if given
        //         hex = hex.replace('#', '');
        //         // If invalid code given return white
        //         if (hex.length !== 3 && hex.length !== 6) {
        //             return [255, 255, 255];
        //         }
        //         // Double up charaters if only three suplied
        //         if (hex.length == 3) {
        //             hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        //         }
        //         // Convert to [r,g,b] array
        //         r = parseInt(hex.substr(0, 2), 16);
        //         g = parseInt(hex.substr(2, 2), 16);
        //         b = parseInt(hex.substr(4, 2), 16);

        //         return [r, g, b];
        //     }

        //     // Converts an RGB color array e.g. [255,255,255] into a hexidecimal color value e.g. 'FFFFFF'
        //     rgbToHex(color) {
        //         // Set boundries of upper 255 and lower 0
        //         color[0] = (color[0] > 255) ? 255 : (color[0] < 0) ? 0 : color[0];
        //         color[1] = (color[1] > 255) ? 255 : (color[1] < 0) ? 0 : color[1];
        //         color[2] = (color[2] > 255) ? 255 : (color[2] < 0) ? 0 : color[2];

        //         return this.zeroFill(color[0].toString(16), 2) + this.zeroFill(color[1].toString(16), 2) + this.zeroFill(color[2].toString(16), 2);
        //     }

        //     // Pads a number with specified number of leading zeroes
        //     zeroFill(number, width) {
        //         width -= number.toString().length;
        //         if (width > 0) {
        //             return [width + (/\./.test(number) ? 2 : 1)].join('0') + number;
        //         }
        //         return number;
        //     }

        //     // Generates an array of color values in sequence from 'colorA' to 'colorB' using the specified number of steps
        //     generateGradient(colorA, colorB, steps) {
        //         const result = [];
        //         let rInterval;
        //         let gInterval;
        //         let bInterval;

        //         colorA = this.hexToRgb(colorA); // [r,g,b]
        //         colorB = this.hexToRgb(colorB); // [r,g,b]
        //         steps -= 1; // Reduce the steps by one because we're including the first item manually

        //         // Calculate the intervals for each color
        //         let rStep = (Math.max(colorA[0], colorB[0]) - Math.min(colorA[0], colorB[0])) / steps;
        //         let gStep = (Math.max(colorA[1], colorB[1]) - Math.min(colorA[1], colorB[1])) / steps;
        //         let bStep = (Math.max(colorA[2], colorB[2]) - Math.min(colorA[2], colorB[2])) / steps;

        //         result.push(`#${this.rgbToHex(colorA)}`);

        //         // Set the starting value as the first color value
        //         let rVal = colorA[0], gVal = colorA[1], bVal = colorA[2];

        //         // Loop over the steps-1 because we're includeing the last value manually to ensure it's accurate
        //         for (let i = 0; i < (steps - 1); i++) {
        //             // If the first value is lower than the last - increment up otherwise increment down
        //             rVal = (colorA[0] < colorB[0]) ? rVal + Math.round(rStep) : rVal - Math.round(rStep);
        //             gVal = (colorA[1] < colorB[1]) ? gVal + Math.round(gStep) : gVal - Math.round(gStep);
        //             bVal = (colorA[2] < colorB[2]) ? bVal + Math.round(bStep) : bVal - Math.round(bStep);
        //             result.push(`#${this.rgbToHex([rVal, gVal, bVal])}`);
        //         }

        //         result.push(`#${this.rgbToHex(colorB)}`);
        //         return result;
        //     }

        //     gradientList(colorA, colorB, steps) {
        //         const colorArray = this.generateGradient(colorA, colorB, steps);
        //         for (let i in colorArray) {
        //             console.log(colorArray[i]);
        //             array_gradient[array_gradient.length] = colorArray[i];
        //         }
        //     }
        // }

        /**
         * Colors extends from GradientArray
         */
        // let colors = new GradientArray();
        let colors = '#FF5C02';
        /**
         * Step by Step
         * @param  {String} "#FFF"
         * @param  {String} "#000"
         * @param  {Integer} 10
         */
        // colors.gradientList('#FFCD9C', '#FF640C', 7);

        Chart.defaults.global.defaultFontColor = '#fff';
        this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: this.labels,
                datasets: [{
                    data: this.data,
                    fill: false,
                    borderColor: '#FF640C',
                    backgroundColor: '#FF640C',
                    borderWidth: 3,
                    lineTension: 0,
                    radius: 5,
                    pointBackgroundColor: colors,
                    title: [0, 10, 17, 34, 29, 20]
                }]
            },
            options: {
                scales: {
                    yAxes: [{ // titles axes
                        ticks: {
                            stepSize: 10,
                            beginAtZero: true,
                            padding: 20
                        },
                        gridLines: {
                            color: '#606A78',
                            lineWidth: 1,
                            drawBorder: false,
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
                legend: {
                    display: false,
                },
                responsive: true,
                animation: {
                    onComplete: function () {
                        var ctx = this.chart.ctx;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        var chart = this;
                        var datasets = this.config.data.datasets;

                        datasets.forEach(function (dataset: Array<any>, i: number) {
                            ctx.font = '5vw OpenSansNauSemibold';
                            ctx.fillStyle = 'White';
                            chart.getDatasetMeta(i).data.forEach(function (p: any, j: any) {
                                ctx.fillText(datasets[i].data[j], p._model.x, p._model.y - 12);
                            });
                        });
                    }
                }
            }

        });

    }
}

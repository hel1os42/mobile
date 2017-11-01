import { Component } from '@angular/core';
var array_gradient = [];

@Component({
  selector: 'page-statistic1',
  templateUrl: 'statistic1.html'
})

export class Statistic1Page {

    labels = [['PERIOD 1', '01/07/2017'], ['PERIOD 2', '01/07/2017']];
    data = [435, 335];
    segment = "realdata";

    constructor() {
    }

}

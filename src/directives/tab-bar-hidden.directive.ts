import { Directive, Input } from '@angular/core';

@Directive({ selector: '[tab-bar-hidden]' })
export class TabBarHiddenDirective {

    @Input('tab-bar-hidden')
    tabHidden: boolean;

    constructor() { }

    ngAfterViewChecked() {

        let tabBarElement: HTMLElement;

        tabBarElement = document.querySelector('.tabbar.show-tabbar');

        if (tabBarElement) {

            if (this.tabHidden) {
                tabBarElement.style.display = 'none';
            } else {
                tabBarElement.style.display = 'flex';
            }
        }
    }
}
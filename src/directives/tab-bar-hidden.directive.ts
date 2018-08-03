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
                tabBarElement.style.opacity = '0';
                tabBarElement.style.pointerEvents = 'none';
            } else {
                tabBarElement.style.opacity = '1';
                tabBarElement.style.pointerEvents = 'all';
            }
        }
    }
}
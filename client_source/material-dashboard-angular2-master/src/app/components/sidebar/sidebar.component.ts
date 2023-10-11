import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app/app.service';
import {ROUTES} from '../../app.component';

declare const $: any;

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    constructor() {
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public get AppService(): typeof AppService {
        return AppService;
    }
}

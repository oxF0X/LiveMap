import {Component, OnInit} from '@angular/core';
import {MapService} from './maps/map.service';
import {AppService} from './app/app.service';


declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export let ROUTES: RouteInfo[] = [];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


    constructor(private mapService: MapService,
                private appService: AppService) {
    }

    ngOnInit() {
        this.appService.initApp();
        ROUTES = [
            // { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
            // { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
            {path: '/maps', title: !AppService.isRtl ? 'Map' : 'מפה', icon: 'location_on', class: ''},
            {
                path: '/table-list',
                title: !AppService.isRtl ? 'Events List' : 'רשימת אירועים',
                icon: 'content_paste',
                class: ''
            },
            // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
            // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
            // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
            // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
        ];
    }
}

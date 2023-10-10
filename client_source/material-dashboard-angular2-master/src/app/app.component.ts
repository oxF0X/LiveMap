import {Component, OnInit} from '@angular/core';
import {catchError, map, tap, throwError} from 'rxjs';
import {GeneralEvent, MapEvent} from './data/types';
import {HttpErrorResponse} from '@angular/common/http';
import {MapService} from './maps/map.service';
import {HttpService} from './http/http.service';
import {AppService} from './app/app.service';


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

    }
}

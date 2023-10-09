import {Component, OnInit} from '@angular/core';
import {MapService} from './map.service';
import {HttpService} from '../http/http.service';
import {catchError, map, tap, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {MapEvent} from '../data/maps.types';

declare const google: any;

interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable?: boolean;
}

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

    constructor(private mapService: MapService,
                private httpService: HttpService) {
    }

    ngOnInit() {
        this.mapService.initMap();
        this.httpService.getMapEvents().pipe(
            map((events: MapEvent[]) => {
                return this.mapService.mapEvents = events;
            }),
            catchError((error: HttpErrorResponse) => {
                // this._translocoService.selectTranslate('Test.Failed to reload the questions').pipe(take(1)).subscribe((translation) => {
                //     this._handleTestErrors(translation);
                // });
                return throwError(() => error);
            })
        ).subscribe((events: MapEvent[]) => {
            events?.forEach((event: MapEvent) => {
                this.mapService.addMarker(event.coordinate);
            });
        });

    }

}

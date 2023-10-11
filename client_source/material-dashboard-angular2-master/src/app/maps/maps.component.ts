import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from './map.service';
import {HttpService} from '../http/http.service';
import {catchError, map, Observable, Subject, takeUntil, tap, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {Coordinate, MapEvent, EventTypeEnum} from '../data/types';
import {AppService} from '../app/app.service';

declare const google: any;

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    mapEvents: MapEvent[];

    constructor(private mapService: MapService,
                private _changeDetectorRef: ChangeDetectorRef,
                private appService: AppService) {
    }

    ngOnInit() {
        this.mapService.initMap();
        ///
        const demo: MapEvent = {
            id: '9823',
            description: 'אירוע נפילת רקטה',
            type: EventTypeEnum.Shooting,
            coordinate: new Coordinate(31.540895, 34.580934)
        };
        this.mapService.addEventMarker(demo);
        ///
        this.appService.mapEvents$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((mapEvents: MapEvent[]) => {
                this.mapEvents = mapEvents;
                // Todo: Check for multiplication
                this.mapEvents?.forEach((event: MapEvent) => {
                });
                this._changeDetectorRef.markForCheck();
            });

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}

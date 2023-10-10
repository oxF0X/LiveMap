import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from './map.service';
import {HttpService} from '../http/http.service';
import {catchError, map, Observable, Subject, takeUntil, tap, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {MapEvent} from '../data/types';
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
        this.appService.mapEvents$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((mapEvents: MapEvent[]) => {
                this.mapEvents = mapEvents;
                // Todo: Check for multiplication
                this.mapEvents.forEach((event: MapEvent) => {
                    this.mapService.addEventMarker(event);
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

import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from './map.service';
import {Subject, takeUntil} from 'rxjs';
import {GeneralEvent} from '../data/types';
import {AppService} from '../app/app.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    events: GeneralEvent[];

    constructor(private mapService: MapService,
                private _changeDetectorRef: ChangeDetectorRef,
                private appService: AppService) {
    }

    ngOnInit() {
        this.mapService.initMap();
        // ///
        // const demo: MapEvent = {
        //     id: '9823',
        //     description: 'אירוע נפילת רקטה',
        //     type: EventTypeEnum.Shooting,
        //     // coordinate: new Coordinate(31.540895, 34.580934)
        //     coordinate: new Coordinate(33.164, 35.6314)
        // };
        // this.mapService.addEventMarker(demo);
        // ///
        this.appService.events$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((events: GeneralEvent[]) => {
                this.events = events;
                this.mapService.removeAllGoogleEventMarkers();
                this.events?.forEach((event: GeneralEvent) => {
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

import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, switchMap, map, catchError, BehaviorSubject, tap, throwError} from 'rxjs';
import {GeneralEvent, MapEvent, TableEvent} from '../data/types';
import {HttpService} from '../http/http.service';
import {DOCUMENT} from '@angular/common';

declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class AppService {
    static isRtl: boolean;
    generalEvents: GeneralEvent[];
    tableEvents: TableEvent[];
    mapEvents: MapEvent[];

    private _tableEvents: BehaviorSubject<TableEvent[] | null> = new BehaviorSubject(null);
    private _mapEvents: BehaviorSubject<MapEvent[] | null> = new BehaviorSubject(null);

    get tableEvents$(): Observable<TableEvent[]> {
        return this._tableEvents.asObservable();
    }

    get mapEvents$(): Observable<MapEvent[]> {
        return this._mapEvents.asObservable();
    }

    constructor(@Inject(DOCUMENT) private document: Document,
                private httpService: HttpService,
                private _httpClient: HttpClient) {
    }

    initApp() {

        this.showNotification('New events', 'danger');

        this.httpService.getAllEvents().pipe(
            tap((events: GeneralEvent[]) => {
                this._mapEvents.next(this.getMapEventsByGeneralEvents(events));
                this._tableEvents.next(this.getTableEventsByGeneralEvents(events));
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        ).subscribe();

        // Set timeout for updating events
        this.httpService.updateEvents().pipe(
            tap((events: GeneralEvent[]) => {
                const newEvents = true;
                if (newEvents) {
                    this.showNotification('New events', 'danger');

                    // Update arrays
                    this._mapEvents.next(this.getMapEventsByGeneralEvents(events));
                    this._tableEvents.next(this.getTableEventsByGeneralEvents(events));
                }
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        ).subscribe();

        this.setAppLanguage(true); ///
    }

    setAppLanguage(isRtl): void {///
        const html = this.document.getElementsByTagName('html')[0];
        if (isRtl) {
            html.lang = 'he';
            html.dir = 'rtl';
            const body = this.document.getElementsByTagName('body')[0];
            body.style.textAlign = 'right';
        } else {
            html.lang = 'en';
        }
        AppService.isRtl = isRtl;
    }

    getMapEventsByGeneralEvents(events: GeneralEvent[]): MapEvent[] { ///
        const mapEvents = [];
        return mapEvents;
    }

    getTableEventsByGeneralEvents(events: GeneralEvent[]): TableEvent[] { ///
        const tableEvents = [];
        return tableEvents;
    }

    showNotification(message: string, type: string, from = 'top', align = 'center') {
        // const type = ['', 'info', 'success', 'warning', 'danger'];

        const color = Math.floor((Math.random() * 4) + 1);

        $.notify({
            icon: "notifications",
            message: message

        }, {
            type: type,
            timer: 4000,
            placement: {
                from: from,
                align: align
            },
            template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                '<i class="material-icons" data-notify="icon">notifications</i> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        });
    }

}

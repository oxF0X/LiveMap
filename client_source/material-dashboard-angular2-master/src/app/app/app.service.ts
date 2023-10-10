import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, switchMap, map, catchError, BehaviorSubject, tap, throwError} from 'rxjs';
import {GeneralEvent, MapEvent, TableEvent} from '../data/types';
import {HttpService} from '../http/http.service';
import {DOCUMENT} from '@angular/common';

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
                    // Show notification

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

}

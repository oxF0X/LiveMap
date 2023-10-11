import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, switchMap, map, catchError, BehaviorSubject, tap, throwError} from 'rxjs';
import {GeneralEvent, MapEvent, TableEvent} from '../data/types';
import {HttpService} from '../http/http.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {
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

    constructor(
        private httpService: HttpService, private _httpClient: HttpClient) {
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

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, switchMap, map, catchError} from 'rxjs';
import {GeneralEvent, MapEvent} from '../data/types';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private apiBasePath: string = '';

    constructor(private _httpClient: HttpClient) {
    }

    getAllEvents(): Observable<GeneralEvent[]> {
        return this._httpClient.get<any[]>(this.apiBasePath + 'all-events');
    }

    updateEvents(): Observable<GeneralEvent[]> {
        return this._httpClient.get<any[]>(this.apiBasePath + 'update-events');
    }

}

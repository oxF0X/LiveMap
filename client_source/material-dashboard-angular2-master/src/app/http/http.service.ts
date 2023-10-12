import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {Coordinate, EventTypeEnum, GeneralEvent} from '../data/types';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private apiBasePath: string = 'http://ec2-51-16-26-124.il-central-1.compute.amazonaws.com/';

    constructor(private _httpClient: HttpClient) {
    }

    getAllEvents(): Observable<GeneralEvent[]> {
        return this._httpClient.get<any[]>(this.apiBasePath + 'events').pipe(
            map((events: any[]) => {
                return this._buildEvents(events).reverse();
            }),
        );
    }

    private _buildEvents(es: any[]): GeneralEvent[] {
        if (es != null) {
            const events = new Array<GeneralEvent>();
            es.forEach((item) => {
                events.push(this._buildEvent(item));
            });
            return events;
        }
    }

    private _buildEvent(e: any): GeneralEvent {
        if (e != null) {
            const event: GeneralEvent = {
                id: e.description.charCodeAt(0) + '&' + e.eventType,
                description: e.description,
                type: e.eventType,
                coordinate: new Coordinate(e.alt, e.lang),
                startTime: e.startTime,
                imageUrl: this.getImageUrlByEventType(e.eventType)
            };
            return event;
        }
    }

    getImageUrlByEventType(eventType: EventTypeEnum): string {
        switch (eventType) {
            case EventTypeEnum.DANGER:
                return 'assets/img/warning.png';
            case EventTypeEnum.ALARMS:
                return 'assets/img/missleIcon.png';
            case EventTypeEnum.ROAD_BLOCKED:
                return 'assets/img/roadblock.png';
        }
    }

}

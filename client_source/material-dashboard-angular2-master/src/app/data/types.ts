import {MapService} from '../maps/map.service';

declare const google: any;

export class Marker {
    // Google maps API entities
    googleInfoWindow: any;
    googleMarker: any;

    constructor(public id: string | number, public coordinate: Coordinate, public type: EventTypeEnum, public content?: string, iconUrl?: string) {
        this.googleMarker = new google.maps.Marker({
            position: MapService.getGoogleCoordinateByCoordinate(this.coordinate),
            icon: {
                url: iconUrl, // Path to your local image file
                scaledSize: new google.maps.Size(30, 30),
            },
            title: type
        });
        this.googleInfoWindow = new google.maps.InfoWindow({
            content: this.content
        });
        this.googleMarker.addListener('click', () => {
            this.googleInfoWindow.open(MapService.map, this.googleMarker);
        });
    }

}

export class Coordinate {
    constructor(public lat: number, public lng: number, public ord: number = null) {
    }
}

export enum EventTypeEnum {
    DANGER = 'DANGER',
    ALARMS = 'ALARMS',
    ROAD_BLOCKED = 'ROAD_BLOCKED'
}

export enum GeneralEventTypeEnum {
    good,
    bad
}

export interface GeneralEvent {
    id: string | number;
    description: string;
    title?: string;
    newsType?: GeneralEventTypeEnum;
    type: EventTypeEnum
    startTime: string;
    coordinate: Coordinate;
    imageUrl: string;
}

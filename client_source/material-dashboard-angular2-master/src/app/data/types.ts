import {MapService} from '../maps/map.service';

declare const google: any;

export class Marker {
    // Google maps API entities
    googleInfoWindow: any;
    googleMarker: any;

    constructor(public id: string, public coordinate: Coordinate, public type: EventTypeEnum, public content?: string) {
        const url = type == EventTypeEnum.Shooting ? 'assets/img/shootingIcon.png' : 'assets/img/missleIcon.png';
        this.googleMarker = new google.maps.Marker({
            position: MapService.getGoogleCoordinateByCoordinate(this.coordinate),
            icon: {
                url: url, // Path to your local image file
                scaledSize: new google.maps.Size(30, 30),
            },
            // title: type of event
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
    missile,
    Shooting
}

export enum GeneralEventTypeEnum {
    good,
    bad
}

export interface GeneralEvent {
    id: string;
    content: string;
    title?: string;
    newsType: GeneralEventTypeEnum;
    eventType: EventTypeEnum
    additionDate: string;
    coordinate: Coordinate;
}

export interface MapEvent {
    id: string;
    description: string;
    type: EventTypeEnum;
    coordinate: Coordinate;
}

export interface TableEvent {
    id: string;
    description: string;
    type: EventTypeEnum;
}

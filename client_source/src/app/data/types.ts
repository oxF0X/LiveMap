import {MapService} from '../maps/map.service';

declare const google: any;

export class Marker {
    // Google maps API entities
    googleInfoWindow: any;
    googleMarker: any;

    constructor(public id: string, public coordinate: Coordinate, public content?: string) {
        this.googleMarker = new google.maps.Marker({
            position: MapService.getGoogleCoordinateByCoordinate(this.coordinate),
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

export enum MapEventTypeEnum {
    missile,
    Shooting
}

export enum GeneralEventTypeEnum {
    good,
    bad
}

export interface GeneralEvent {
    id: string;
    description: string;
    type: GeneralEventTypeEnum;
    coordinate: Coordinate;
}

export interface MapEvent {
    id: string;
    description: string;
    type: MapEventTypeEnum;
    coordinate: Coordinate;
}

export interface TableEvent {
    id: string;
    description: string;
    type: MapEventTypeEnum;
}

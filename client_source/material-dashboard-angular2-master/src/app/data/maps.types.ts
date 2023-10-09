export interface Marker
{
    id?: string;
    content?: string;
    completed?: string;
}

export interface Polygon
{
    id?: string;
    content?: string;
    completed?: string;
}

export class Coordinate
{
    constructor(public lat: number, public lng: number, public ord: number = null) {
    }
}

export enum MapEventTypeEnum {
    missile,
    Shooting
}

export interface MapEvent
{
    type: MapEventTypeEnum;
    coordinate: Coordinate;
}

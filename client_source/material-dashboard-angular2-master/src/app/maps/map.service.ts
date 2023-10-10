import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, switchMap, map, catchError} from 'rxjs';
import {Coordinate, MapEvent, MapEventTypeEnum, Marker} from '../data/types';

declare const google: any;

@Injectable({
    providedIn: 'root'
})
export class MapService {
    static map: any;
    mapOptions: any = {
        zoom: 13,
        // scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
        scrollwheel: true,
        styles: [{
            "featureType": "water",
            "stylers": [{
                "saturation": 43
            }, {
                "lightness": -11
            }, {
                "hue": "#0088ff"
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{
                "hue": "#ff0000"
            }, {
                "saturation": -100
            }, {
                "lightness": 99
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#808080"
            }, {
                "lightness": 54
            }]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ece2d9"
            }]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ccdca1"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#767676"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#ffffff"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#b8cb93"
            }]
        }, {
            "featureType": "poi.park",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.sports_complex",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.medical",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.business",
            "stylers": [{
                "visibility": "simplified"
            }]
        }]

    };
    mapEvents: MapEvent[];

    constructor(private _httpClient: HttpClient) {
    }

    initMap() {
        MapService.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

        const geocoder = new google.maps.Geocoder();
        const countryName = "Israel";
        geocoder.geocode({address: countryName}, (results, status) => {
            if (status === "OK" && results[0]) {
                const countryBounds = results[0].geometry.viewport;
                MapService.map.fitBounds(countryBounds);
            } else {
                console.error("Geocode was not successful for the following reason: " + status);
            }
        });

        // const demo: MapEvent = {
        //     id: '9823',
        //     description: 'אירוע נפילת רקטה',
        //     type: MapEventTypeEnum.missile,
        //     coordinate: new Coordinate(31.540895, 34.580934)
        // };
        // this.addEventMarker(demo);
        // this.fitMap([
        //     new Coordinate(31.540895, 34.580934),
        //     new Coordinate(31.538774, 34.586770),
        //     new Coordinate(31.538408, 34.604065),
        //     new Coordinate(31.524103, 34.614838),
        //     new Coordinate(31.512242, 34.602926),
        //     new Coordinate(31.516273, 34.588195),
        //     new Coordinate(31.528986, 34.579738)
        // ])
    }

    addEventMarker(event: MapEvent) {
        const marker = new Marker(event.id, new Coordinate(event.coordinate.lat, event.coordinate.lng), event.description)
        marker.googleMarker.setMap(MapService.map);
    }

    fitMap(coordinates: Coordinate[]) {
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach(coordinate => {
            bounds.extend(MapService.getGoogleCoordinateByCoordinate(coordinate));
        });
        MapService.map.fitBounds(bounds);
    }

    static getGoogleCoordinateByCoordinate(coordinate: Coordinate) {
        return new google.maps.LatLng(coordinate.lat, coordinate.lng);
    }

}

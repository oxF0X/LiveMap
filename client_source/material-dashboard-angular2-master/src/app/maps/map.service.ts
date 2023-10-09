import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, switchMap, map, catchError} from 'rxjs';
import {Coordinate, MapEvent} from '../data/maps.types';

declare const google: any;

@Injectable({
    providedIn: 'root'
})
export class MapService {
    initMapCenter: Coordinate;
    map: any;
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
        // this.initMapCenter = new Coordinate(31.528748, 34.596346)
        // this.mapOptions.center = new google.maps.LatLng(this.initMapCenter.lat, this.initMapCenter.lng);
        this.map = new google.maps.Map(document.getElementById("map"), this.mapOptions);
        this.fitMap([
            new Coordinate(31.540895, 34.580934),
            new Coordinate(31.538774, 34.586770),
            new Coordinate(31.538408, 34.604065),
            new Coordinate(31.524103, 34.614838),
            new Coordinate(31.512242, 34.602926),
            new Coordinate(31.516273, 34.588195),
            new Coordinate(31.528986, 34.579738)
        ])
    }

    addPolygon(coordinates: Coordinate[]) {
        // const marker = new google.maps.Marker({
        //     position: new google.maps.LatLng(coordinate.lat, coordinate.lng),
        //     title: "Hello World!"
        // });
        // marker.setMap(this.map);
    }

    addMarker(coordinate: Coordinate) {
        const marker = new google.maps.Marker({
            position: this.getGoogleCoordinateByCoordinate(coordinate),
            title: "Hello World!"
        });

        const infowindow = new google.maps.InfoWindow({
            content: 'Info content goes here', // This can be HTML content or plain text
          });

        marker.addListener('mouseover', () => {
            infowindow.open(this.map, marker); // Open the info window when mouseover occurs
        });
          
        marker.addListener('mouseout', () => {
            infowindow.close(); // Close the info window when mouseout occurs
        });

        marker.setMap(this.map);
    }

    fitMap(coordinates: Coordinate[]) {
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach(coordinate => {
            bounds.extend(this.getGoogleCoordinateByCoordinate(coordinate));
        });
        this.map.fitBounds(bounds);
    }

    getGoogleCoordinateByCoordinate(coordinate: Coordinate) {
        return new google.maps.LatLng(coordinate.lat, coordinate.lng);
    }

}

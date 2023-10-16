import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, catchError, BehaviorSubject, tap, throwError} from 'rxjs';
import {GeneralEvent} from '../data/types';
import {HttpService} from '../http/http.service';
import {DOCUMENT} from '@angular/common';

declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class AppService {
    static isRtl: boolean;
    isLast = true;
    private _events: BehaviorSubject<GeneralEvent[] | null> = new BehaviorSubject(null);

    get events$(): Observable<GeneralEvent[]> {
        return this._events.asObservable();
    }

    constructor(@Inject(DOCUMENT) private document: Document,
                private httpService: HttpService,
                private _httpClient: HttpClient) {
    }

    initApp() {
        this.setAppLanguage(true); ///
        this.getEvents(true);
        if(this.isLast)
            setInterval(() => this.getEvents(), 500);
    }

    getEvents(isFirstTime: boolean = false) {
        this.isLast = false
        this.httpService.getAllEvents().pipe(
            tap((events: GeneralEvent[]) => {
                if (isFirstTime) {
                    this._events.next(events);
                } else if (!isFirstTime) {
                    const {added, removed} = this.compareArraysByObjectId(this._events.value != null ? this._events.value : [], events);
                    if (this.checkForNewEvents({added, removed})) {
                        // Update array
                        this._events.next(events);
                        let content = '';
                        added.forEach((i: GeneralEvent, index) => {
                            content += i.startTime + ' | ' + i.description;
                            if (index != added.length - 1) {
                                content += '<br>';
                            }
                        });
                        this.showNotification(content, 'danger');
                    }
                }

            }),
            catchError((error: HttpErrorResponse) => {
                this.isLast = true
                return throwError(() => error);
            })
        ).subscribe();
        this.isLast = true

    }

    checkForNewEvents({added, removed}): boolean {
        if (added.length != 0 || removed.length != 0) {
            return true;
        } else {
            return false;
        }
    }

    compareArraysByObjectId(arr1, arr2) {
        const removed = [];
        const added = [];

        // Check for removed objects
        for (const obj1 of arr1) {
            if (!arr2.some(obj2 => obj2.id === obj1.id)) {
                removed.push(obj1);
            }
        }

        // Check for added objects
        for (const obj2 of arr2) {
            if (!arr1.some(obj1 => obj1.id === obj2.id)) {
                added.push(obj2);
            }
        }

        // added.push(
        //     {"id":"1501&DANGER","description":"אירוע מסוים ","type":"DANGER","coordinate":{"lat":31.7683,"lng":35.2137,"ord":null},"startTime":"16:50:35","imageUrl":"assets/img/warning.png"}
        // )

        return {added, removed};
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

    showNotification(message: string, type: string, from = 'top', align = 'center') {
        // const type = ['', 'info', 'success', 'warning', 'danger'];

        const color = Math.floor((Math.random() * 4) + 1);

        $.notify({
            icon: "notifications",
            message: message

        }, {
            type: type,
            timer: 4000,
            placement: {
                from: from,
                align: align
            },
            template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                '<i class="material-icons" data-notify="icon">notifications</i> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        });
    }

}
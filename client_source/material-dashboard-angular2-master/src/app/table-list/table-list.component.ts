import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil, tap} from 'rxjs';
import {HttpService} from '../http/http.service';
import {AppService} from '../app/app.service';
import {GeneralEvent} from '../data/types';

@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    events: GeneralEvent[];
    firstLoading: boolean;

    constructor(private appService: AppService,
                private _changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.firstLoading = true;
        this.appService.events$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((events: GeneralEvent[]) => {
                if (this.firstLoading) {
                    this.firstLoading = false;
                }
                this.events = events;
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}

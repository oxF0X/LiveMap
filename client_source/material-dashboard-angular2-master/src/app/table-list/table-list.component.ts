import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil, tap} from 'rxjs';
import {HttpService} from '../http/http.service';
import {AppService} from '../app/app.service';
import {MapEvent, TableEvent} from '../data/types';

@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    tableEvents: TableEvent[];

    constructor(private appService: AppService,
                private _changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.appService.tableEvents$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tableEvents: TableEvent[]) => {
                this.tableEvents = tableEvents;
                // Todo: Check for multiplication
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}

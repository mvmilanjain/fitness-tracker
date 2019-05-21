import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';

@Injectable()
export class UIService {

    loadingStateChanged = new Subject<boolean>();

    constructor(private snackBar: MatSnackBar) {}

    startLoading() {
        this.loadingStateChanged.next(true);
    }

    stopLoading() {
        this.loadingStateChanged.next(false);
    }

    showSnackBar(message: string, action: any, duration: number) {
        this.snackBar.open(message, action, {
            duration: duration
        });
    }

}
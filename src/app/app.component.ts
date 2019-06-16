import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from './shared/services/auth.service';
import * as fromRoot from './app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.authService.initAuthListener();
  }

}

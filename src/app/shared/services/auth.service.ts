import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';

import { AuthData } from '../models/auth-data.model';
import { TrainingService } from './training.service';
import { UIService } from './ui.service';
import * as fromRoot from '../../app.reducer';
import * as UI from '../ui.actions';
import * as Auth from '../../auth/auth.actions';

@Injectable()
export class AuthService {

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UIService,
              private store: Store<fromRoot.State>) {
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(err => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackBar(err.message, null, 3000);
    });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(err => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackBar(err.message, null, 3000);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}

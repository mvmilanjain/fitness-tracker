import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs/index';

import { User } from '../models/user.model';
import { AuthData } from '../models/auth-data.model';
import { TrainingService } from './training.service';
import { UIService } from './ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  isAuthenticated: boolean = false;
  private user: User;

  constructor(private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService) {
  }

  registerUser(authData: AuthData) {
    this.uiService.startLoading();
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      this.uiService.stopLoading();
    }).catch(err => {
      this.uiService.stopLoading();
      this.uiService.showSnackBar(err.message, null, 3000);
    });
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    })
  }

  login(authData: AuthData) {
    this.uiService.startLoading();
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      this.uiService.stopLoading();
    }).catch(err => {
      this.uiService.stopLoading();
      this.uiService.showSnackBar(err.message, null, 3000);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }

}

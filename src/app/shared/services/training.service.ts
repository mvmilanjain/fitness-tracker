import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/internal/operators';
import { Store } from '@ngrx/store';

import { Exercise } from '../models/exercise.model';
import { UIService } from './ui.service';
import * as fromTraining from '../../training/training.reducer';
import * as UI from '../ui.actions';
import * as Training from '../../training/training.actions';

@Injectable()
export class TrainingService {

  private fbSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService,
              private store: Store<fromTraining.State>) {
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubscriptions.push(this.db.collection('availableExercises').snapshotChanges().pipe(map(docArr => {
      return docArr.map((doc: any) => {
        return {
          id: doc.payload.doc.id,
          ...doc.payload.doc.data()
        };
      });
    })).subscribe((exercises: Exercise[]) => {
      this.store.dispatch(new UI.StopLoading());
      this.store.dispatch(new Training.SetAvailableTrainings(exercises));
    }, error => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackBar('Fetching Exercises failed, please try again later', null, 3000);
      this.store.dispatch(new Training.SetAvailableTrainings(null));
    }));
  }

  startExercise(selectedId: string): void {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise(): void {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe((training: Exercise) => {
      this.addDataToDatabase({
        ...training,
        date: new Date(),
        state: 'Completed'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number): void {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe((training: Exercise) => {
      this.addDataToDatabase({
        ...training,
        duration: training.duration * (progress / 100),
        calories: training.calories * (progress / 100),
        date: new Date(),
        state: 'Cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubscriptions.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
      this.store.dispatch(new Training.SetFinishedTrainings(exercises));
    }, error => console.error(error)));
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

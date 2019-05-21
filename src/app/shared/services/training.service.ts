import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs/index';
import { map } from 'rxjs/operators';

import { Exercise } from '../models/exercise.model';
import { UIService } from './ui.service';

@Injectable()
export class TrainingService {

  availableExercises: Exercise[] = [];
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private runningExercise: Exercise;
  private fbSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore,
    private uiService: UIService) {
  }

  fetchAvailableExercises() {
    this.uiService.startLoading();
    this.fbSubscriptions.push(this.db.collection('availableExercises').snapshotChanges().
      pipe(map(docArr => {
        return docArr.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          };
        });
      })).subscribe((exercises: Exercise[]) => {
        this.uiService.stopLoading();
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        this.uiService.stopLoading();
        this.uiService.showSnackBar('Fetching Exercises failed, please try again later', null, 3000);
        this.exercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string): void {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise(): void {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'Completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number): void {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'Cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise(): Exercise {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubscriptions.push(this.db.collection('finishedExercises').valueChanges().
      subscribe((exercises: Exercise[]) => {
        console.log(exercises);
        this.finishedExercisesChanged.next(exercises);
      }, error => console.error(error)));
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
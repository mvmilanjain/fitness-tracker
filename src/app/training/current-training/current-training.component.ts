import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { take } from 'rxjs/internal/operators';
import { Store } from '@ngrx/store';

import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../../shared/services/training.service';
import { Exercise } from '../../shared/models/exercise.model';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer: any;

  constructor(private dialog: MatDialog,
              private trainingService: TrainingService,
              private store: Store<fromTraining.State>) {
  }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe((training: Exercise) => {
      const step = training.duration * 10;
      this.timer = setInterval(() => {
        this.progress = (this.progress < 100) ? this.progress + 1 : 100;
        if (this.progress >= 100) {
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step)
    });
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {progress: this.progress}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    }, err => {
      console.error(err);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/index';
import { Store } from '@ngrx/store';

import { TrainingService } from '../../shared/services/training.service';
import { Exercise } from '../../shared/models/exercise.model';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  exercises$: Observable<Exercise[]>;

  constructor(private trainingService: TrainingService,
              private store: Store<fromTraining.State>) {
  }

  ngOnInit() {
    this.exercises$ = this.store.select(fromTraining.getAvailableTraining);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}

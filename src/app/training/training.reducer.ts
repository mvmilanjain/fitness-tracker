import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  TrainingActions,
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING
} from './training.actions';
import { Exercise } from '../shared/models/exercise.model';
import * as fromRoot from '../app.reducer';

export interface TrainingState {
  availableTrainings: Exercise[],
  finishedTrainings: Exercise[],
  activeTraining: Exercise
}

export interface State extends fromRoot.State {
  training: TrainingState
}

const initialState: TrainingState = {
  availableTrainings: [],
  finishedTrainings: [],
  activeTraining: null
};

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableTrainings: [...action.payload]
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedTrainings: [...action.payload]
      };
    case START_TRAINING:
      return {
        ...state,
        activeTraining: {...state.availableTrainings.find(ex => ex.id === action.payload)}
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeTraining: null
      };
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');
export const getAvailableTraining = createSelector(getTrainingState, (state: TrainingState) => state.availableTrainings);
export const getFinishedTraining = createSelector(getTrainingState, (state: TrainingState) => state.finishedTrainings);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining !== null);

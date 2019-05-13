import { Exercise } from './exercise.model';
import { Subject } from 'rxjs/index';

export class TrainingService {

  availableExercises: Exercise[] = [
    {id: 'crunches', name: 'Crunches', duration: 5, calories: 8},
    {id: 'touch-toes', name: 'Touch Toes', duration: 8, calories: 15},
    {id: 'side-lunges', name: 'Side Lunges', duration: 12, calories: 18},
    {id: 'burpees', name: 'Burpees', duration: 10, calories: 8}
  ];
  exerciseChanged = new Subject<Exercise>();

  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  getAvailableExercises(): Exercise[] {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string): void {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise(): void {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'Completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number): void {
    this.exercises.push({
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
    return {...this.runningExercise};
  }

  getCompletedOrCancelledExercises(): Exercise[] {
    return this.exercises.slice();
  }

}

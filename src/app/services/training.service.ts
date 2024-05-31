import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { IDeleteResponce, ITraining } from '../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private readonly trainingUrl = 'training';

  constructor(private apiService: ApiService) {}

  createTraining(params: Partial<ITraining>): Observable<ITraining> {
    return this.apiService
      .postRequest(this.trainingUrl, params)
      .pipe(map((res) => res.newTraining));
  }

  deleteTraining(trainingId: string): Observable<string> {
    return this.apiService.deleteRequest(`${this.trainingUrl}/${trainingId}`);
  }

  deleteAllMyTraining(): Observable<IDeleteResponce> {
    return this.apiService.deleteRequest(`${this.trainingUrl}/all`);
  }

  getAllTrainings(
    params?: any
  ): Observable<{ trainingList: ITraining[]; totalCount: number }> {
    return this.apiService.getRequest(this.trainingUrl, params);
  }

  getAllRelevantTraining(params: {
    offset: number;
    limit: 5 | 10 | 15 | 20 | 30 | 50;
  }): Observable<{ trainingList: ITraining[]; totalCount: number }> {
    return this.apiService.getRequest(`${this.trainingUrl}/relevant`, params);
  }

  updateTraining(
    trainingId: string,
    params: { repeatLevel?: number, nextRepeatDate?: Date }
  ): Observable<ITraining> {
    return this.apiService
      .patchRequest(`${this.trainingUrl}/${trainingId}`, params)
      .pipe(map((res) => res.updatedTraining));
  }
}

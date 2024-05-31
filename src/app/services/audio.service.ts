import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { IWord } from '../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private readonly urlAudio = 'audio';

  constructor(private apiService: ApiService) {}

  uploadAudio(file: File, wordId: string): Observable<IWord> {
    const formData = new FormData();
    formData.append('audio', file);

    return this.apiService
      .postRequest(`${this.urlAudio}/${wordId}`, formData)
      .pipe(map((res) => res.updatedWord));
  }

  deleteAudio(wordId: string): Observable<IWord> {
    return this.apiService
      .deleteRequest(`${this.urlAudio}/${wordId}`)
      .pipe(map((res) => res.updatedWord));
  }
}

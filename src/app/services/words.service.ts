import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { IWord } from '../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  private readonly wordsUrl = 'words';
  private readonly trainingUrl = 'training';

  constructor(private apiService: ApiService) {}

  createWord(params: Partial<IWord>): Observable<IWord> {
    return this.apiService
      .postRequest(this.wordsUrl, params)
      .pipe(map((res) => res.newWord));
  }

  deleteWord(wordId: string): Observable<{ wordId: string }> {
    return this.apiService.deleteRequest(`${this.wordsUrl}/${wordId}`);
  }

  addWordToTrainingList(wordId: string): Observable<{ wordId: string }> {
    return this.apiService.postRequest(`${this.trainingUrl}/${wordId}`);
  }

  markWordAsKnown(wordId: string): Observable<{ wordId: string }> {
    return this.apiService.patchRequest(`${this.wordsUrl}/known/${wordId}`);
  }

  removekWordFromKnown(wordId: string): Observable<{ wordId: string }> {
    return this.apiService.patchRequest(`${this.wordsUrl}/unknown/${wordId}`);
  }

  getWordList(
    params?: any
  ): Observable<{
    wordList: IWord[];
    totalCount: number;
    inTrainingCount: number;
    inKnownCount: number;
    allCount: number;
  }> {
    return this.apiService.getRequest(this.wordsUrl, params);
  }

  getWordById(wordId: string): Observable<IWord> {
    return this.apiService
      .getRequest(`${this.wordsUrl}/${wordId}`)
      .pipe(map((res) => res.word));
  }

  updateWord(wordId: string, params: any): Observable<IWord> {
    return this.apiService
      .patchRequest(`${this.wordsUrl}/update/${wordId}`, params)
      .pipe(map((res) => res.updatedWord));
  }
}

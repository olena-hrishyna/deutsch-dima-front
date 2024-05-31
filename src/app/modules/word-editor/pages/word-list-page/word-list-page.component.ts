import { Component } from '@angular/core';
import { WordsService } from '../../../../services/words.service';
import {
  IDialogData,
  IWord,
  LEVEL,
  PART_OF_SPEECH,
  PART_OF_SPEECH_TRANSLATIONS,
} from '../../../../shared/interfaces';
import { WordCardComponent } from '../../components/word-card/word-card.component';
import { LoaderComponent } from '../../../../shared/components/loader.component';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { catchError, filter, switchMap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteHistoryService } from '../../../../services/route-history.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { getLocalStorage, saveLocalStorage } from '../../../../shared/handlers';
import {
  PAGE_WORD_LEVEL_KEY,
  PAGE_WORD_LIST_SIZE_KEY,
  PAGE_WORD_SORT_KEY,
  PAGE_WORD_HIDE_TRAINING_KEY,
  PAGE_WORD_HIDE_KNOWING_KEY,
} from '../../../../shared/constants';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../services/auth.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Title } from '@angular/platform-browser';
import { MyPaginatorIntl } from '../../../../shared/components/my-paginator-intl';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-word-list-page',
  standalone: true,
  imports: [
    WordCardComponent,
    LoaderComponent,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    SearchInputComponent,
    NgClass,
    NgTemplateOutlet,
    MatCheckboxModule,
  ],
  templateUrl: './word-list-page.component.html',
  styleUrl: './word-list-page.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: MyPaginatorIntl }],
})
export class WordListPageComponent {
  isSuperAdmin = this.authService.isSuperAdmin();
  isAdmin = this.authService.isAdmin();
  wordList: IWord[] = [];
  isLoading = true;
  isHideInTraning = false;
  isHideKnown = false;
  pageSizeOptions = [10, 20, 30, 50, 100, 200, 500, 1000];
  pageSize: number;
  pageIndex = 0;
  totalCount = 0;
  inTrainingCount = 0;
  inKnownCount = 0;
  allCount = 0;
  partOfSpeechArr = Object.values(PART_OF_SPEECH);
  transtations = PART_OF_SPEECH_TRANSLATIONS;
  selectedType?: PART_OF_SPEECH | 'all' = 'all';
  searchDe: string = '';
  searchRu: string = '';
  levelArr = Object.values(LEVEL);
  selectedLevel: LEVEL | null = null;
  sort: any = { titleDe: 1 };

  constructor(
    private title: Title,
    private wordsService: WordsService,
    public historyService: RouteHistoryService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.title.setTitle('Список слов');
    this.searchDe = this.route.snapshot.queryParams['searchDe'] || '';
    this.searchRu = this.route.snapshot.queryParams['searchRu'] || '';
    this.pageSize =
      getLocalStorage(PAGE_WORD_LIST_SIZE_KEY) || this.pageSizeOptions[2];
    this.isHideInTraning =
      getLocalStorage(PAGE_WORD_HIDE_TRAINING_KEY) || false;
    this.isHideKnown = getLocalStorage(PAGE_WORD_HIDE_KNOWING_KEY) || false;
    this.sort = getLocalStorage(PAGE_WORD_SORT_KEY) || { titleDe: 1 };
    this.selectedLevel = getLocalStorage(PAGE_WORD_LEVEL_KEY) || null;
    this.getWords();
  }

  onTypeChange(type: PART_OF_SPEECH): void {
    this.selectedType = type;
    this.getWords();
  }

  onHandlePageEvent({ pageSize, pageIndex }: PageEvent): void {
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.getWords();
    saveLocalStorage(PAGE_WORD_LIST_SIZE_KEY, pageSize);
  }

  onAction({
    wordId,
    action,
  }: {
    wordId: string;
    action: 'delete' | 'add' | 'add-known' | 'remove-known';
  }): void {
    switch (action) {
      case 'delete':
        const data: IDialogData = {
          confirmButtonColor: 'warn',
          title: 'Удалить слово?',
          confirmButton: 'Удалить',
        };

        this.matDialog
          .open(ConfirmDialogComponent, {
            width: '400px',
            disableClose: true,
            panelClass: 'my-dialog',
            data,
          })
          .afterClosed()
          .pipe(
            filter(Boolean),
            switchMap(() => {
              this.isLoading = true;
              return this.wordsService.deleteWord(wordId);
            }),
            catchError((err) => {
              this.openSnackBar('Ошибка удаления слова', true);
              this.isLoading = false;
              return throwError(() => err);
            })
          )
          .subscribe(() => {
            this.isLoading = false;
            this.openSnackBar('Слово удалено');
            this.wordList = this.wordList.filter((el) => el._id !== wordId);
            --this.totalCount;
          });
        break;
      case 'add':
        // add a word to training
        this.wordsService
          .addWordToTrainingList(wordId)
          .pipe(
            catchError((err) => {
              this.isLoading = false;
              this.openSnackBar(
                err?.error?.message || 'Ошибка добавления слова в тренировки',
                true
              );
              return throwError(() => err);
            })
          )
          .subscribe(() => {
            this.isLoading = false;
            this.openSnackBar('Слово добавленно в список тренировки');
            this.wordList = this.wordList.map((el) =>
              el._id !== wordId ? el : { ...el, isInTraining: true }
            );
            ++this.inTrainingCount;
          });
        break;
      case 'add-known':
        this.wordsService
          .markWordAsKnown(wordId)
          .pipe(
            catchError((err) => {
              this.isLoading = false;
              this.openSnackBar(
                err?.error?.message ||
                  'Ошибка добавления слова в известные вам',
                true
              );
              return throwError(() => err);
            })
          )
          .subscribe(() => {
            this.isLoading = false;
            this.openSnackBar('Слово помечено как уже известное вам');
            this.wordList = this.wordList.map((el) =>
              el._id !== wordId ? el : { ...el, isKnown: true }
            );
            ++this.inKnownCount;
          });
        break;
      case 'remove-known':
        this.wordsService
          .markWordAsKnown(wordId)
          .pipe(
            catchError((err) => {
              this.isLoading = false;
              this.openSnackBar(
                err?.error?.message || 'Ошибка удаления слова из известных',
                true
              );
              return throwError(() => err);
            })
          )
          .subscribe(() => {
            this.isLoading = false;
            this.openSnackBar('Слово удалено из уже известных вам');
            this.wordList = this.wordList.map((el) =>
              el._id !== wordId ? el : { ...el, isKnown: false }
            );
            --this.inKnownCount;
          });
        break;
    }
  }

  openSnackBar(message: string, isError = false): void {
    this.snackBar.open(message, 'Ok', {
      duration: 4000,
      panelClass: isError ? 'red-snack' : 'green-snack',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  getWords(): void {
    this.isLoading = true;
    const searchDe = this.searchDe;
    const searchRu = this.searchRu;
    const level = this.selectedLevel;
    const isHideInTraning = this.isHideInTraning;
    const isHideKnown = this.isHideKnown;
    const params = {
      offset: this.pageIndex,
      limit: this.pageSize,
      partOfSpeech: this.selectedType,
      sort: JSON.stringify(this.sort),
      ...(isHideInTraning && { isHideInTraning }),
      ...(isHideKnown && { isHideKnown }),
      ...(searchDe && { searchDe }),
      ...(searchRu && { searchRu }),
      ...(level && { level }),
    };
    this.wordsService
      .getWordList(params)
      .pipe(
        catchError((err) => {
          this.openSnackBar('Ошибка получения слов', true);
          this.isLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe((res) => {
        const {
          wordList,
          totalCount = 0,
          inTrainingCount = 0,
          inKnownCount = 0,
          allCount = 0
        } = res;
        this.wordList = wordList;
        this.totalCount = totalCount;
        this.inTrainingCount = inTrainingCount;
        this.inKnownCount = inKnownCount;
        this.allCount = allCount;
        this.isLoading = false;
        console.log({totalCount, inTrainingCount, inKnownCount})
      });
  }

  onSearchChanged(search: string | null, lang: 'de' | 'ru'): void {
    const searchParam = search?.trim() || '';
    switch (lang) {
      case 'de':
        this.searchDe = searchParam;
        break;
      case 'ru':
        this.searchRu = searchParam;
        break;
    }
    this.routerNavigate();
    this.getWords();
  }

  onLevel(level: LEVEL | null): void {
    this.selectedLevel = level;
    this.getWords();
    saveLocalStorage(PAGE_WORD_LEVEL_KEY, level);
  }

  onSort(sort: any): void {
    this.sort = sort;
    this.getWords();
    saveLocalStorage(PAGE_WORD_SORT_KEY, sort);
  }

  onShow(state: boolean, isFirst = false): void {
    if (isFirst) {
      this.isHideInTraning = state;
      saveLocalStorage(PAGE_WORD_HIDE_TRAINING_KEY, state);
    } else {
      this.isHideKnown = state;
      saveLocalStorage(PAGE_WORD_HIDE_KNOWING_KEY, state);
    }
    this.getWords();
  }

  routerNavigate(): void {
    this.router.navigate([], {
      queryParams: { searchDe: this.searchDe, searchRu: this.searchRu },
    });
  }
}

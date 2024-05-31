import { Component, HostListener } from '@angular/core';
import { TrainingService } from '../../../../services/training.service';
import { LoaderComponent } from '../../../../shared/components/loader.component';
import {
  Observable,
  catchError,
  forkJoin,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import {
  AUXILIARY_VERB,
  IDeleteResponce,
  IDialogData,
  ITestTask,
  ITestWord,
  ITraining,
  PART_OF_SPEECH,
} from '../../../../shared/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { Step1Component } from '../../components/step-1/step-1.component';
import {
  getLocalStorage,
  getRandomIndex,
  mixArray,
  saveLocalStorage,
  uniqueArray,
} from '../../../../shared/handlers';
import { Step2Component } from '../../components/step-2/step-2.component';
import { Step3Component } from '../../components/step-3/step-3.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import {
  LIMIT_TRAINING_KEY,
  PAGE_TRAINING_SIZE_KEY,
} from '../../../../shared/constants';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { MyPaginatorIntl } from '../../../../shared/components/my-paginator-intl';

type LIMIT = 5 | 10 | 15 | 20 | 30 | 50;

@Component({
  selector: 'app-trainer-page',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    LoaderComponent,
    MatButtonToggleModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    Step1Component,
    Step2Component,
    Step3Component,
    MatProgressSpinnerModule,
  ],
  templateUrl: './trainer-page.component.html',
  styleUrl: './trainer-page.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: MyPaginatorIntl }],
})
export class TrainerPageComponent {
  isSuperAdmin = this.authService.isSuperAdmin();
  isAdmin = this.authService.isAdmin();
  isLoading = false;
  isAllWordLoading = false;
  subtitle = '';
  step = 0;
  limit: LIMIT;
  offset = 0;
  totalRelevCount = 0;
  relevantTraining: ITraining[] = [];
  allTrainings: ITraining[] = [];
  testTasks_1: ITestTask[] = [];
  testTasks_2: ITestTask[] = [];
  testTasks_3: ITestTask[] = [];
  testTasks_4: ITestTask[] = [];
  mistakeIds: string[] = [];
  mistakeTrainings: ITraining[] = [];
  correctTrainings: ITraining[] = [];

  pageSizeOptions = [10, 20, 30, 50, 100, 200, 500, 1000];
  pageSize: number;
  pageIndex = 0;
  totalCount = 0;

  constructor(
    private title: Title,
    private authService: AuthService,
    private trainingService: TrainingService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {
    this.title.setTitle('Словарный тренажер');
    this.limit = getLocalStorage(LIMIT_TRAINING_KEY) || 5;
    this.pageSize =
      getLocalStorage(PAGE_TRAINING_SIZE_KEY) || this.pageSizeOptions[2];
    this.getAllTrainings();
    this.getRelevantTrainings();
  }

  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent
  ): void {
    if (this.step === 5 && event.key === 'Enter') {
      this.onSave();
    }
  }

  onHandlePageEvent({ pageSize, pageIndex }: PageEvent): void {
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.getAllTrainings();
    saveLocalStorage(PAGE_TRAINING_SIZE_KEY, pageSize);
  }

  getTestTasks(): void {
    this.testTasks_1 = [];
    this.testTasks_2 = [];
    this.testTasks_3 = [];
    this.testTasks_4 = [];

    if (this.relevantTraining.length) {
      this.relevantTraining.forEach((t) => {
        const trainingId = t._id;
        const audio = t.word.audio;
        const article = t.word.article;
        const ruTitle = this.getWordTitles(t, 'ru');
        const base = {
          trainingId,
          ...(article && { article }),
          ...(audio && { audio }),
        };
        const {
          isReflexivVerb,
          prefix,
          titleDePl,
          isTrennbareVerben,
          exampleUsage = '',
          partOfSpeech,
          auxiliaryVerb,
          perfektForm,
          level,
        } = t.word;

        this.testTasks_1.push({
          ...base,
          ...(partOfSpeech === PART_OF_SPEECH.Verb && {
            pastForm: `${
              auxiliaryVerb === AUXILIARY_VERB.sein ? 'ist' : 'hat'
            } ${perfektForm}`,
          }),
          testTitle: this.getWordTitles(t, 'de', 1),
          testWords: this.getWords(trainingId, 'ru'),
          level,
          exampleUsage,
          titleDePl,
          isReflexivVerb,
          isTrennbareVerben,
          prefix,
        });

        this.testTasks_2.push({
          ...base,
          testTitle: ruTitle,
          testWords: this.getWords(trainingId, 'de', 2),
          exampleUsage,
          level,
        });

        const answer = this.getWordTitles(t, 'de', 3);
        const deLetters = this.getLetters(answer);
        this.testTasks_3.push({
          ...base,
          testTitle: ruTitle,
          testAnswer: deLetters,
          testLetters: mixArray(deLetters),
        });

        this.testTasks_4.push({
          ...base,
          testAnswer: answer,
          testTitle: ruTitle,
        });
      });

      this.testTasks_1 = mixArray(this.testTasks_1);
      this.testTasks_2 = mixArray(this.testTasks_2);
      this.testTasks_3 = mixArray(this.testTasks_3);
      this.testTasks_4 = mixArray(this.testTasks_4);
    }
  }

  getRelevantTrainings(): void {
    this.relevantTraining = [];
    this.isLoading = true;
    const params = {
      offset: this.offset,
      limit: this.limit,
    };

    this.trainingService
      .getAllRelevantTraining(params)
      .pipe(
        catchError((err) => {
          this.openSnackBar('Ошибка получения тренингов', 5000, true);
          this.isLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe(({ totalCount = 0, trainingList }) => {
        this.totalRelevCount = totalCount;
        this.relevantTraining = trainingList;
        this.correctTrainings = [];
        this.mistakeTrainings = [];
        this.subtitle = this.getSubtitle(totalCount);
        this.isLoading = false;
        this.getTestTasks();
      });
  }

  getAllTrainings(): void {
    this.isAllWordLoading = true;
    const params = {
      offset: this.pageIndex,
      limit: this.pageSize,
    };
    this.trainingService
      .getAllTrainings(params)
      .pipe(
        catchError((err) => {
          this.openSnackBar(
            'Ошибка получения списка всех тренингов',
            5000,
            true
          );
          this.isAllWordLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe(({ trainingList, totalCount = 0 }) => {
        this.isAllWordLoading = false;
        this.allTrainings = trainingList;
        this.totalCount = totalCount;
      });
  }

  getLetters(word: string): string[] {
    return word.split('');
  }

  getWordTitles(
    training: ITraining,
    lang: 'de' | 'ru',
    step?: 1 | 2 | 3
  ): string {
    if (lang === 'ru') {
      return training.word.titleRu.join(', ');
    } else {
      return step === 1
        ? training.word.titleDe
        : `${
            training.word.article && step !== 3
              ? training.word.article + ' '
              : ''
          }${training.word.isReflexivVerb && step === 2 ? '(sich) ' : ''}${
            training.word.prefix || ''
          }${training.word.titleDe}`;
    }
  }

  getRepeat(level: number): string {
    let repeat = `завтра`;

    switch (++level) {
      case 2:
        repeat = 'через 3 дня';
        break;
      case 3:
        repeat = 'через 7 дней';
        break;
      case 4:
        repeat = 'через 14 дней';
        break;
      case 5:
        repeat = 'через 30 дней';
        break;
      case 6:
        repeat = 'через 60 дней';
        break;
      case 7:
        repeat = 'через 90 дней';
        break;
      case 8:
        repeat = 'через 180 дней';
        break;
      case 9:
        repeat = 'через 360 дней';
        break;
      case 10:
        repeat = 'слово изучено ❤️';
        break;
    }

    return repeat;
  }

  getWords(
    trainingId: string,
    lang: 'de' | 'ru',
    step?: 1 | 2 | 3
  ): ITestWord[] {
    const words = this.relevantTraining.map((t) => {
      return {
        trainingId,
        wordTitle: this.getWordTitles(t, lang, step),
        isCorrect: trainingId === t._id,
      };
    });
    const mixWords = mixArray(words);

    // удаляем лишнее количество вариантов
    while (mixWords.length > 4) {
      const randomIndex = getRandomIndex(words);

      if (!mixWords[randomIndex]?.isCorrect) {
        mixWords.splice(randomIndex, 1);
      }
    }

    return mixWords;
  }

  getSubtitle(count: number, isSecont = false): string {
    const c = Number(String(count).slice(-1));
    const word = (c === 1 && 'слово') || (c > 1 && c < 5 && 'слова') || 'слов';

    return isSecont
      ? `Всего ${count} ${word} в активной тренировке${count ? ':' : '.'}`
      : `${count} ${word} нужно повторить сегодня.`;
  }

  onLiminChange(limit: LIMIT): void {
    this.limit = limit;
    saveLocalStorage(LIMIT_TRAINING_KEY, limit);
    this.getRelevantTrainings();
  }

  onStart(): void {
    this.step = ++this.step;
  }

  openSnackBar(message: string, duration = 4000, isError = false): void {
    this.snackBar.open(message, 'Ok', {
      duration,
      panelClass: isError ? 'red-snack' : 'green-snack',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onMistake(trainingId: string): void {
    this.mistakeIds.push(trainingId);
  }

  onEnd(): void {
    this.step = ++this.step;

    if (this.step === 5) {
      this.mistakeIds = uniqueArray(this.mistakeIds);

      this.relevantTraining.forEach((el) => {
        if (this.mistakeIds.includes(el._id)) {
          this.mistakeTrainings.push(el);
        } else {
          this.correctTrainings.push(el);
        }
      });
    }
  }

  onChangeError(trainingId: string, action: 'remove' | 'add'): void {
    switch (action) {
      case 'remove':
        this.mistakeTrainings = this.mistakeTrainings.filter((el) => {
          if (el._id === trainingId) {
            this.correctTrainings.push(el);
            return;
          } else {
            return true;
          }
        });
        break;
      case 'add':
        this.correctTrainings = this.correctTrainings.filter((el) => {
          if (el._id === trainingId) {
            this.mistakeTrainings.push(el);
            return;
          } else {
            return true;
          }
        });
        break;
    }
  }

  onDeleteTraining(trainingId: string): void {
    const data: IDialogData = {
      confirmButtonColor: 'warn',
      title: 'Удаление тренировки',
      text: 'Вы уверены, что хотите навсегда удалить тренировку этого слова? Вы сможете добавить его снова, но прогресс не сохранится',
      confirmButton: 'Удалить',
      unConfirmButton: 'Отменить',
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
        switchMap((confirm: boolean) => {
          this.isLoading = confirm;
          return confirm
            ? this.trainingService.deleteTraining(trainingId)
            : of(null);
        }),
        catchError((err) => {
          this.openSnackBar('Ошибка удадения тренинга', 5000, true);
          this.isLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe((trainingId: string | null) => {
        this.isLoading = false;
        if (trainingId) {
          this.openSnackBar('Слово удалено из тренировки', 6000);
          this.getRelevantTrainings();
          this.allTrainings = this.allTrainings.filter(
            (el) => el._id !== trainingId
          );
          this.step = 0;
        }
      });
  }

  onDateUpdate(trainingId: string): void {
    this.isLoading = true;
    this.trainingService
      .updateTraining(trainingId, {
        repeatLevel: 0,
        nextRepeatDate: new Date(),
      })
      .pipe(
        catchError((err) => {
          this.isLoading = false;
          this.openSnackBar(
            err?.error?.message || 'Что-то пошло не так',
            5000,
            true
          );
          return throwError(() => err);
        })
      )
      .subscribe((updetedTr: ITraining) => {
        this.isLoading = false;
        this.allTrainings = this.allTrainings.map((el) => {
          return el._id === trainingId ? updetedTr : el;
        });
        this.getRelevantTrainings();
      });
  }

  onCancelTraining(): void {
    this.step = 0;
    this.getTestTasks();
  }

  onClearTrainings(): void {
    const data: IDialogData = {
      confirmButtonColor: 'warn',
      title: 'Удаление ВСЕХ ваших тренировок',
      text: 'Вы уверены, что хотите навсегда удалить все ваши тренировки? Вы сможете добавить слова снова, но прогресс не сохранится',
      confirmButton: 'Удалить',
      unConfirmButton: 'Отменить',
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
        switchMap((confirm: boolean) => {
          this.isLoading = confirm;
          return confirm
            ? this.trainingService.deleteAllMyTraining()
            : of(null);
        }),
        catchError((err) => {
          this.openSnackBar('Ошибка удаления тренировок', 5000, true);
          this.isLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe((resp: IDeleteResponce | null) => {
        this.isLoading = false;
        if (resp?.deletedItems?.acknowledged) {
          this.allTrainings = [];
          this.relevantTraining = [];
          this.totalRelevCount = 0;
          this.totalCount = 0;
          this.openSnackBar(
            resp.message || 'Все тренировки удалены успешно',
            6000
          );
        }
      });
  }

  onSave(): void {
    this.isLoading = true;
    const requests: Observable<ITraining>[] = [];

    this.correctTrainings.forEach((el) => {
      requests.push(
        this.trainingService.updateTraining(el._id, {
          repeatLevel: ++el.repeatLevel,
        })
      );
    });
    this.mistakeTrainings.forEach((el) => {
      requests.push(
        this.trainingService.updateTraining(el._id, {
          repeatLevel: 1,
        })
      );
    });
    if (requests.length) {
      forkJoin(requests)
        .pipe(
          map((results: ITraining[]) => {
            this.isLoading = false;
            console.log({ results });
            this.step = 0;
            this.getRelevantTrainings();
            this.getAllTrainings();
          }),
          catchError((err) => {
            this.openSnackBar(
              err?.error?.message || 'Что-то пошло не так',
              5000,
              true
            );
            this.isLoading = false;
            return throwError(() => err);
          })
        )
        .subscribe(() => (this.isLoading = false));
    }
  }
}

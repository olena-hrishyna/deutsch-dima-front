import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { WordsService } from '../../../../services/words.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ARTICLE,
  AUXILIARY_VERB,
  PART_OF_SPEECH,
  PART_OF_SPEECH_TRANSLATIONS,
  LEVEL,
  IWord,
  IDialogData,
} from '../../../../shared/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { CommonModule, NgClass } from '@angular/common';
import { UploadAudioComponent } from '../../components/upload-audio/upload-audio.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AudioPlayerComponent } from '../../../../shared/components/audio-player/audio-player.component';
import { removeEmptyValueFromArrey } from '../../../../shared/handlers';
import { LoaderComponent } from '../../../../shared/components/loader.component';
import { RouteHistoryService } from '../../../../services/route-history.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-add-words-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatButtonModule,
    UploadAudioComponent,
    AudioPlayerComponent,
    LoaderComponent,
    RouterLink,
    NgClass,
    MatRadioModule,
    MatTooltipModule,
  ],
  templateUrl: './add-words-page.component.html',
  styleUrl: './add-words-page.component.scss',
})
export class AddWordsPageComponent {
  edidingWord?: IWord;
  form: FormGroup;
  isLoading = false;
  isEditMode = false;
  currentTitle = '';
  levelArr = Object.values(LEVEL);
  selectedLevel = LEVEL.A1;
  partOfSpeech = PART_OF_SPEECH;
  partOfSpeechArr = Object.values(PART_OF_SPEECH);
  transtations = PART_OF_SPEECH_TRANSLATIONS;
  selectedType: PART_OF_SPEECH = PART_OF_SPEECH.Noun;
  articles = Object.values(ARTICLE);
  selectedArticle: ARTICLE = ARTICLE.der;
  isTrennbareVerben = true;
  auxiliaryVerb = AUXILIARY_VERB;
  isReflexivVerb = false;
  selectedAuxiliaryVerb: AUXILIARY_VERB = AUXILIARY_VERB.haben;
  isIrregular = false;

  get titleRuArray(): FormArray {
    return this.form.get('titleRuArray') as FormArray;
  }

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private wordsService: WordsService,
    private route: ActivatedRoute,
    private router: Router,
    public historyService: RouteHistoryService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {
    const edidingWordId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!edidingWordId;

    this.currentTitle = `${
      this.isEditMode ? 'Редагувати' : 'Додати нове'
    } слово`;

    this.title.setTitle(this.currentTitle);

    this.form = this.fb.group({
      titleDe: '',
      titleDePl: '',
      feminin: '',
      exampleUsage: '',
      titleRuArray: this.fb.array(['']),
      prefix: '',
      perfektForm: '',
      präteritumFormIch: '',
      präteritumFormDu: '',
      präteritumFormEr: '',
      präteritumFormWir: '',
      präteritumFormIhr: '',
      konjunktiv2FormIch: '',
      konjunktiv2FormDu: '',
      konjunktiv2FormEr: '',
      konjunktiv2FormWir: '',
      konjunktiv2FormIhr: '',
    });

    if (edidingWordId) {
      this.isLoading = true;
      this.isEditMode = true;
      this.wordsService.getWordById(edidingWordId).subscribe((res) => {
        if (res) {
          this.edidingWord = res;
          this.selectedType = PART_OF_SPEECH[res.partOfSpeech];
          this.selectedLevel = res.level;
          this.isReflexivVerb = res.isReflexivVerb || false;
          this.isTrennbareVerben = res.isTrennbareVerben || false;
          this.selectedAuxiliaryVerb =
            res.auxiliaryVerb || AUXILIARY_VERB.haben;

          this.form.patchValue(res);

          const article = res?.article as ARTICLE;
          if (article) {
            this.onArticle(article);
          }

          if (res.titleRu?.length) {
            this.removeTitleRuField(0);

            res.titleRu.forEach((e) => {
              this.addTitleRuField(e);
            });
          }
        }
        this.isLoading = false;
      });
    }
  }

  openSnackBar(message: string, isError = false): void {
    this.snackBar.open(message, 'Ok', {
      duration: 5000,
      panelClass: [isError ? 'red-snack' : 'green-snack'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onTypeChange(type: PART_OF_SPEECH): void {
    this.selectedType = type;
  }

  onCancel(): void {}

  onArticle(article: ARTICLE): void {
    this.selectedArticle = article;
  }

  onLevel(level: LEVEL): void {
    this.selectedLevel = level;
  }

  onTrennbareVerben(state: boolean): void {
    this.isTrennbareVerben = state;
  }

  onAuxiliaryVerb(state: AUXILIARY_VERB): void {
    this.selectedAuxiliaryVerb = state;
  }

  onUpdatedWord(word: IWord): void {
    this.edidingWord = word;
  }

  onSubmit(): void {
    this.isLoading = true;
    const {
      exampleUsage,
      titleDe,
      titleDePl = '-',
      feminin,
      prefix,
      perfektForm,
      präteritumFormIch,
      präteritumFormDu,
      präteritumFormEr,
      präteritumFormWir,
      präteritumFormIhr,
    } = this.form.value;

    const titleRu = removeEmptyValueFromArrey(
      this.titleRuArray?.controls.map((e) => e.value?.trim())
    );

    const params = {
      exampleUsage,
      titleDe: titleDe.trim(),
      titleRu,
      partOfSpeech: this.selectedType,
      level: this.selectedLevel,
      ...(this.selectedType === PART_OF_SPEECH.Noun && {
        article: this.selectedArticle,
        titleDePl,
        feminin,
      }),
      ...(this.selectedType === PART_OF_SPEECH.Verb && {
        isIrregular: this.isIrregular,
        isTrennbareVerben: this.isTrennbareVerben,
        prefix: prefix?.trim() || '',
        isReflexivVerb: this.isReflexivVerb,
        auxiliaryVerb: this.selectedAuxiliaryVerb,
        perfektForm,
        präteritumFormIch,
        präteritumFormDu,
        präteritumFormEr,
        präteritumFormWir,
        präteritumFormIhr,
      }),
    };

    const request = this.edidingWord
      ? this.wordsService.updateWord(this.edidingWord._id, params)
      : this.wordsService.createWord(params);

    request
      .pipe(
        catchError((err) => {
          this.openSnackBar(
            err?.error?.error || 'Помилка збереження слова',
            true
          );
          this.isLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe((word) => {
        this.openSnackBar('Слово збережено успішно');
        this.isLoading = false;

        if (!this.isEditMode) {
          this.router.navigate([`/word-editor/edit-word/${word._id}`]);
        }
      });
  }

  addTitleRuField(val = ''): void {
    const newTitleRuControl = this.fb.control(val, Validators.required);
    this.titleRuArray.push(newTitleRuControl);
  }

  removeTitleRuField(index: number): void {
    this.titleRuArray.removeAt(index);
  }

  onAddToTraining(): void {
    const wordId = this.edidingWord?._id;
    if (wordId) {
      this.isLoading = true;
      this.wordsService
        .addWordToTrainingList(wordId)
        .pipe(
          catchError((err) => {
            this.isLoading = false;
            this.openSnackBar(err?.error?.message || 'Щось пішло не так', true);
            return throwError(() => err);
          })
        )
        .subscribe(() => {
          this.isLoading = false;
          this.openSnackBar('Слово додано до списку тренування');
        });
    }
  }

  onRegularChange(isIrregular: boolean): void {
    this.isIrregular = !isIrregular;
  }

  onReflexivVerb(): void {
    this.isReflexivVerb = !this.isReflexivVerb;
  }

  onDeleteWord(): void {
    const data: IDialogData = {
      confirmButtonColor: 'warn',
      title: 'Видалення слова',
      text: 'Ви впевнені, що хочете видалити це слово назавжди',
      confirmButton: 'Видалити',
      unConfirmButton: 'Відмінити',
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
          const id = this.edidingWord?._id;

          return confirm && id ? this.wordsService.deleteWord(id) : of(null);
        }),
        catchError((err) => {
          this.openSnackBar('Помилка вилучення слова', true);
          this.isLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe((id: { wordId: string } | null) => {
        this.isLoading = false;
        if (id) {
          this.openSnackBar('Слово видалено');
          this.router.navigate(['/word-editor/word-list']);
        }
      });
  }
}

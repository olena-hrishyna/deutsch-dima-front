import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { WelcomePageComponent } from './shared/components/welcome-page/welcome-page.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/vocabulary-trainer',
  },
  {
    path: 'welcome',
    component: WelcomePageComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'vocabulary-trainer',
    loadChildren: () =>
      import('./modules/vocabulary-trainer/vocabulary-trainer.module').then(
        (m) => m.VocabularyTrainerModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'word-editor',
    loadChildren: () =>
      import('./modules/word-editor/word-editor.module').then(
        (m) => m.WordEditorModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

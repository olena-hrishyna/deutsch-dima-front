import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorLayoutPageComponent } from './pages/editor-layout-page/editor-layout-page.component';
import { AddWordsPageComponent } from './pages/add-words-page/add-words-page.component';
import { WordListPageComponent } from './pages/word-list-page/word-list-page.component';
import { AdminGuard } from '../../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: EditorLayoutPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'add-word',
    component: AddWordsPageComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'edit-word/:id',
    component: AddWordsPageComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'word-list',
    component: WordListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WordEditorRoutingModule {}

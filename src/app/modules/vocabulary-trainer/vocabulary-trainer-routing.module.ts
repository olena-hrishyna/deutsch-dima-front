import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerPageComponent } from './pages/trainer-page/trainer-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'traiter',
    pathMatch: 'full',
  },
  {
    path: 'traiter',
    component: TrainerPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VocabularyTrainerRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinalePage } from './finale.page';

const routes: Routes = [
  {
    path: '',
    component: FinalePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinalePageRoutingModule {}

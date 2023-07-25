import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {ListFrequentQuestionsComponent} from "./list-frequent-questions/list-frequent-questions.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ListFrequentQuestionsComponent
      }
    ])
  ]
})
export class FrequentQuestionsPageRoutingModule {

}

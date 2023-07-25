import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFrequentQuestionsComponent } from './list-frequent-questions/list-frequent-questions.component';
import {SharedModule} from "../shared/shared.module";
import {FrequentQuestionsPageRoutingModule} from "./frequent-questions-page.routing.module";



@NgModule({
  declarations: [
    ListFrequentQuestionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FrequentQuestionsPageRoutingModule,
  ]
})
export class FrequentQuestionsPageModule { }

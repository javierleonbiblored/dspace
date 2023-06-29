import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HelpPageRoutingModule} from "./help-page-routing.module";
import {HelpPageComponent} from "./help-page.component";
import {ThemedHelpPageComponent} from "./themed-help-page.component";
import {SharedModule} from "../shared/shared.module";

const DECLARATIONS = [
  HelpPageComponent,
  ThemedHelpPageComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HelpPageRoutingModule
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class HelpPageModule { }

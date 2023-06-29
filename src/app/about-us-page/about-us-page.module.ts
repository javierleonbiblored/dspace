import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AboutUsPageComponent} from "./about-us-page.component";
import {SharedModule} from "../shared/shared.module";
import {ThemedAboutUsPageComponent} from "./themed-about-us-page.component";
import {AboutUsPageRoutingModule} from "./about-us-page-routing.module";

const DECLARATIONS = [
  AboutUsPageComponent,
  ThemedAboutUsPageComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AboutUsPageRoutingModule
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class AboutUsPageModule { }

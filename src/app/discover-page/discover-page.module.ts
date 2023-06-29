import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemedDiscoverPageComponent} from "./themed-discover-page.component";
import {DiscoverPageComponent} from "./discover-page.component";
import {DiscoverPageRoutingModule} from "./discover-page-routing.module";
import {SharedModule} from "../shared/shared.module";


const DECLARATIONS = [
  DiscoverPageComponent,
  ThemedDiscoverPageComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DiscoverPageRoutingModule
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class DiscoverPageModule { }

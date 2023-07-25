import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibloredDigitalRepositoryPageComponent } from './biblored-digital-repository-page/biblored-digital-repository-page.component';
import {BibloredDigitalRepositoryPageRoutingModule} from "./biblored-digital-repository-page-routing.module";
import {SharedModule} from "../shared/shared.module";
import {HomePageModule} from "../home-page/home-page.module";



@NgModule({
  declarations: [
    BibloredDigitalRepositoryPageComponent
  ],
    imports: [
        CommonModule,
        BibloredDigitalRepositoryPageRoutingModule,
        SharedModule,
    ]
})
export class BibloredDigitalRepositoryModule { }

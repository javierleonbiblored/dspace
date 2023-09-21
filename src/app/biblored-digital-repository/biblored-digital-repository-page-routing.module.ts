import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  BibloredDigitalRepositoryPageComponent
} from "./biblored-digital-repository-page/biblored-digital-repository-page.component";

/**
 * Routing module to help navigate Bitstream pages
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BibloredDigitalRepositoryPageComponent,
      },

    ])
  ],
})
export class BibloredDigitalRepositoryPageRoutingModule {
}

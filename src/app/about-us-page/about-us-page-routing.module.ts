import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ThemedAboutUsPageComponent} from "./themed-about-us-page.component";


const routes: Routes = [
  {
    path: '',
    component: ThemedAboutUsPageComponent,
    /* data: {
       title: 'home.title',
       menu: {
         public: [{
           id: 'statistics_site',
           active: true,
           visible: true,
           index: 2,
           model: {
             type: MenuItemType.LINK,
             text: 'menu.section.statistics',
             link: 'statistics',
           } as LinkMenuItemModel,
         }],
       },
     },*/
    /* resolve: {
       site: HomePageResolver
     }*/
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    // HomePageResolver
  ]
})
export class AboutUsPageRoutingModule {
}

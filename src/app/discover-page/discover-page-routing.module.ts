import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ThemedDiscoverPageComponent} from "./themed-discover-page.component";


const routes: Routes = [
  {
    path: '',
    component: ThemedDiscoverPageComponent,
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
export class DiscoverPageRoutingModule {
}

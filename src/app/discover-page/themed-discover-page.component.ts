import { Component } from '@angular/core';
import {ThemedComponent} from "../shared/theme-support/themed.component";
import {DiscoverPageComponent} from "./discover-page.component";

/**
 * Themed wrapper for HelpPageComponent
 */
@Component({
  selector: 'ds-themed-discover-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedDiscoverPageComponent extends ThemedComponent<DiscoverPageComponent> {
  protected getComponentName(): string {
    return 'DiscoverPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/discover-page/discover-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./discover-page.component`);
  }

}

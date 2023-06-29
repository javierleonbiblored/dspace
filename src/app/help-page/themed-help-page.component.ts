import { Component } from '@angular/core';
import {ThemedComponent} from "../shared/theme-support/themed.component";
import {HelpPageComponent} from "./help-page.component";

/**
 * Themed wrapper for HelpPageComponent
 */
@Component({
  selector: 'ds-themed-help-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedHelpPageComponent extends ThemedComponent<HelpPageComponent> {
  protected getComponentName(): string {
    return 'HelpPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/help-page/help-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./help-page.component`);
  }

}

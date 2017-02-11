import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core'

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  selector: 'responsive-app',
  styleUrls: [],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}

import { NgModule, ModuleWithProviders }        from '@angular/core'
import { CommonModule }                         from '@angular/common'
import { FormsModule }                          from '@angular/forms'
import { RouterModule }                         from '@angular/router'

import { FooterComponent }                      from './footer/footer.component'
import { NavbarComponent }                      from './navbar/navbar.component'
import { NewsService }                          from './news-service/index'

@NgModule({
  imports: [ CommonModule, RouterModule ],
  declarations: [ FooterComponent, NavbarComponent ],
  exports: [FooterComponent, NavbarComponent,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NewsService]
    }
  }
}
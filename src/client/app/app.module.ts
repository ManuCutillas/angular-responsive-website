
import  { NgModule }                             from '@angular/core'
import  { FormsModule }                          from '@angular/forms'
import  { HomeModule }                           from './home/home.module'
import  { AppRoutingModule }                     from './app-routing.module'
import  { AppComponent }                         from './app.component'
import  { ResponsiveModule, ResponsiveConfig }   from 'ng2-responsive'

const config = {
    breakPoints: {
            xs: {max: 600},
            sm: {min: 601, max: 959},
            md: {min: 960, max: 1279},
            lg: {min: 1280, max: 1919},
            xl: {min: 1920}
    },
    debounceTime: 100
};

export function ResponsiveDefinition(){ 
   return new ResponsiveConfig( config )
}


@NgModule({
  declarations:[ 
      AppComponent 
  ],
  imports: [
    HomeModule,
    AppRoutingModule,
    ResponsiveModule
  ],
  providers:[
  {
    provide: ResponsiveConfig, 
    useFactory: ResponsiveDefinition 
  }]
})
export class AppModule {}
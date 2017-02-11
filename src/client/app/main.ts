import { enableProdMode }              from '@angular/core'
import { platformBrowserDynamic }      from '@angular/platform-browser-dynamic'
import { TranslationProviders }        from './i18n.providers'
import { AppModule }                   from './app.module'

enableProdMode()

let TP = new TranslationProviders()
TP.getTranslationFile().then((providers: any) => 
{
  const options: any = { providers }
  platformBrowserDynamic().bootstrapModule( AppModule, options )
})
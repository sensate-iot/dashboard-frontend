import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function main() {
  if(window.location.pathname === '/') {
    window.location.pathname = '/dashboard';
  }
  console.log(`Path name : ${window.location.pathname}`);

  if(environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
}

main().then(() => {});

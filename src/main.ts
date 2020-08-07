import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {ModuleRegistry} from '@ag-grid-community/all-modules';
import {AllCommunityModules} from '@ag-grid-community/all-modules';

if (environment.production) {
  enableProdMode();
}
ModuleRegistry.registerModules(AllCommunityModules);
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

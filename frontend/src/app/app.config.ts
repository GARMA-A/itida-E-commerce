import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection , importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
        importProvidersFrom( 
      FormsModule,
      ReactiveFormsModule
    )
  ]
  
};

import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { httpErrorInterceptor } from './interceptors/http-error.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { ErrorHandlerService } from './guards/services/error/error-handler.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Services
import {
    ApiService,
    AuthService,
    CacheService,
    ConfigService,
    HttpService,
    LoadingService,
    LoggerService,
    StorageService
} from './guards/services';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        TranslateModule
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        TranslateModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useValue: httpErrorInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useValue: loadingInterceptor,
            multi: true
        },
        {
            provide: ErrorHandler,
            useClass: ErrorHandlerService
        },
        // Core Services
        ApiService,
        AuthService,
        AuthGuard,
        CacheService,
        ConfigService,
        HttpService,
        LoadingService,
        LoggerService,
        StorageService
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only.');
        }
    }

    static forRoot() {
        return {
            ngModule: CoreModule,
            providers: [
                // Add your singleton services here
            ]
        };
    }
}
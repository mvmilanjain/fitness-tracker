import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
    declarations: [
        WelcomeComponent,
        HeaderComponent,
        SidenavListComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        WelcomeComponent,
        HeaderComponent,
        SidenavListComponent
    ]
})
export class CoreModule { }
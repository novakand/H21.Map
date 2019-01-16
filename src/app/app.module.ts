import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { H21MapModule } from 'projects/h21-map/src/components/h21-map.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        H21MapModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { CrawlerStatusComponent } from './components/crawler-status/crawler-status.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsComponent,
    CrawlerStatusComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
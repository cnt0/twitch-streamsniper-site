import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { StreamsService } from './streams.service';

import { StreamComponent } from './stream/stream.component';

@NgModule({
  declarations: [
    AppComponent,
    StreamComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [StreamsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

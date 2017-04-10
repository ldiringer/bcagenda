import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, RootComponent } from './routes';

import { AppComponent } from './app.component';

import { TalkService } from './talk.service';
import { ShareComponent } from './share/share.component';

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    TalkService,
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }

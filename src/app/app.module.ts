import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SortingAlgosComponent } from './sorting-algos/sorting-algos.component';
import { FormsModule } from '@angular/forms';
import { PathfindingAlgosComponent } from './pathfinding-algos/pathfinding-algos.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    SortingAlgosComponent,
    PathfindingAlgosComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

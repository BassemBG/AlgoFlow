import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PathfindingAlgosComponent } from './pathfinding-algos/pathfinding-algos.component';
import { SortingAlgosComponent } from './sorting-algos/sorting-algos.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'pathfinding', component: PathfindingAlgosComponent },
  { path: 'sorting', component: SortingAlgosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

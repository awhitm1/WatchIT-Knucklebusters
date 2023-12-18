import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthComponent } from './auth/auth.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SearchResultsComponent } from './search-results/search-results.component';

const routes: Routes = [
  {path: '', redirectTo: '/landing-page', pathMatch: 'full'},
  {path: 'landing-page', component: LandingPageComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'home-page', component: HomePageComponent},
  {path: 'search-results', component: SearchResultsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

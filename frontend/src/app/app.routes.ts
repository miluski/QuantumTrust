import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './logged-part.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home-page',
    pathMatch: 'full',
  },
  {
    path: 'home-page',
    loadChildren: () =>
      import('./home-page/home-page.module').then((m) => m.HomePageModule),
  },
  {
    path: 'main-page',
    loadChildren: () =>
      import('./main-page/main-page.module').then((m) => m.MainPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'single-account',
    loadChildren: () =>
      import('./single-account/single-account.module').then(
        (m) => m.SingleAccountModule
      ),
  },
  {
    path: 'single-deposit',
    loadChildren: () =>
      import('./single-deposit/single-deposit.module').then(
        (m) => m.SingleDepositModule
      ),
  },
  {
    path: 'single-card',
    loadChildren: () =>
      import('./single-card/single-card.module').then(
        (m) => m.SingleCardModule
      ),
  },
  {
    path: 'open-account',
    loadChildren: () =>
      import('./guest-open-account/guest-open-account.module').then(
        (m) => m.GuestOpenAccountModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'unauthorized',
    loadChildren: () =>
      import('./unauthorized/unauthorized.module').then(
        (m) => m.UnauthorizedModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
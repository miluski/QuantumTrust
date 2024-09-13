import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { AccountListComponent } from './account-list/account-list.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardListComponent } from './card-list/card-list.component';
import { DepositListComponent } from './deposit-list/deposit-list.component';
import { FinancesComponent } from './finances/finances.component';
import { FooterComponent } from './footer/footer.component';
import { GuestHeaderComponent } from './guest-header/guest-header.component';
import { GuestMobileHeaderComponent } from './guest-mobile-header/guest-mobile-header.component';
import { GuestOpenAccountComponent } from './guest-open-account/guest-open-account.component';
import { HeaderComponent } from './header/header.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SingleAccountComponent } from './single-account/single-account.component';
import { SingleCardComponent } from './single-card/single-card.component';
import { SingleDepositComponent } from './single-deposit/single-deposit.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { UserMobileHeaderComponent } from './user-mobile-header/user-mobile-header.component';
import { UserOpenAccountComponent } from './user-open-account/user-open-account.component';

@NgModule({
  imports: [
    FooterComponent,
    HeaderComponent,
    HomePageComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    AccountListComponent,
    DepositListComponent,
    CardListComponent,
    SingleAccountComponent,
    SingleDepositComponent,
    SingleCardComponent,
    LoginComponent,
    MainPageComponent,
    FinancesComponent,
    GuestHeaderComponent,
    GuestMobileHeaderComponent,
    UserHeaderComponent,
    UserMobileHeaderComponent,
    UserOpenAccountComponent,
    GuestOpenAccountComponent,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  declarations: [AppComponent],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}

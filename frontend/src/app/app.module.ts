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
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OpenAccountComponent } from './open-account/open-account.component';
import { SingleAccountComponent } from './single-account/single-account.component';
import { SingleCardComponent } from './single-card/single-card.component';
import { SingleDepositComponent } from './single-deposit/single-deposit.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FooterComponent,
    HeaderComponent,
    HomePageComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    AccountListComponent,
    DepositListComponent,
    CardListComponent,
    SingleAccountComponent,
    RouterModule,
  ],
  declarations: [
    AppComponent,
    OpenAccountComponent,
    LoginComponent,
    SingleDepositComponent,
    SingleCardComponent,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}

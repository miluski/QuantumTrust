import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  imports: [CommonModule, HeaderComponent, FooterComponent],
  standalone: true,
})
export class MainPageComponent {}

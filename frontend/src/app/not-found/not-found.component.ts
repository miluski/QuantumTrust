import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderStateService } from '../header-state.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  standalone: true,
})
export class NotFoundComponent implements OnInit {
  isDrawerOpened: boolean = false;
  constructor(private headerStateService: HeaderStateService) {}
  ngOnInit(): void {
    this.headerStateService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened) => (this.isDrawerOpened = isDrawerOpened)
    );
  }
}

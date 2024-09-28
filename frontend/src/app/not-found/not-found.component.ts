import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  standalone: true,
})
export class NotFoundComponent implements OnInit {
  protected isDrawerOpened: boolean = false;
  constructor(
    private appInformationStatesService: AppInformationStatesService
  ) {}
  ngOnInit(): void {
    this.appInformationStatesService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened: boolean) => (this.isDrawerOpened = isDrawerOpened)
    );
  }
}

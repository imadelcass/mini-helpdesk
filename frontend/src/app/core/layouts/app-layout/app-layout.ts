import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from '@core/services/auth';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, AvatarModule, ButtonModule, ButtonGroupModule, RouterLink, CommonModule],
  templateUrl: './app-layout.html',
})
export class AppLayout {
  constructor(public authService: Auth, public router: Router) {}

  currentYear: number = new Date().getFullYear();
}

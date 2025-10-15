import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from '@core/services/auth';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, AvatarModule, ButtonModule, ButtonGroupModule],
  templateUrl: './app-layout.html',
})
export class AppLayout {
  constructor(public authService: Auth) {}

  currentYear: number = new Date().getFullYear();
}

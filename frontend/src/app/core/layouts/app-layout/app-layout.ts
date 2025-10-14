import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, AvatarModule, ButtonModule],
  templateUrl: './app-layout.html',
})
export class AppLayout {
  currentYear: number = new Date().getFullYear();
}

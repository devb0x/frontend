import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

import { AuthService } from "../../auth/auth.service"
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  userIsAuth: boolean = false
  private authListenerSubs!: Subscription

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userIsAuth = this.authService.getIsAuth()
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isUserAuth => {
        this.userIsAuth = isUserAuth
      })
  }
}

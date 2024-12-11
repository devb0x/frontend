import { Component } from '@angular/core'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router"
import { CommonModule } from "@angular/common"

import { Subscription } from "rxjs"

import { AuthService } from "../../auth/auth.service"

import { SearchBarComponent } from "../search-bar/search-bar.component"

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [
		CommonModule,
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		SearchBarComponent
	],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css'
})
export class NavbarComponent {
	userIsAuth:boolean = false
	private authListenerSubs!: Subscription
	private routerEventsSub!: Subscription
	mobileMenuOpen: boolean = false

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit() {
		this.userIsAuth = this.authService.getIsAuth()
		this.authListenerSubs = this.authService
			.getAuthStatusListener()
			.subscribe(isUserAuth => {
				this.userIsAuth = isUserAuth
			})
	}

	ngOnDestroy() {
		this.authListenerSubs.unsubscribe()
		this.routerEventsSub.unsubscribe()
	}

	toggleMobileNav() {

		this.mobileMenuOpen = !this.mobileMenuOpen;
		if (!this.mobileMenuOpen) {
			this.hiddeMobileNav()
		}
		setTimeout(() => {
			const ul = document.querySelector('.mobile-navbar-list') as HTMLElement
			ul.classList.toggle('translate')

			const icon = document.querySelector('.nav-icon') as HTMLElement
			icon.classList.toggle('open')
		}, 50)
	}

	hiddeMobileNav() {
		this.mobileMenuOpen = false
		const mobileNav = document.querySelector('.mobile-navbar') as HTMLElement
		if (mobileNav) {
			mobileNav.classList.remove('display')
			mobileNav.classList.add('hidden')
		}
	}

}

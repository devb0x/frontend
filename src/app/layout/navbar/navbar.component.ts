import { Component, Inject } from '@angular/core'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router"
import { CommonModule } from "@angular/common"

import { Subscription } from "rxjs"

import { AuthService } from "../../auth/auth.service"
import { WINDOW, windowProvider } from "../../services/window.service"

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
	styleUrl: './navbar.component.css',
	providers: [
		windowProvider
	]
})
export class NavbarComponent {
	userIsAuth:boolean = false
	private authListenerSubs!: Subscription
	private routerEventsSub!: Subscription
	mobileMenuOpen: boolean = false
	windowHeight = this.window.innerHeight

	constructor(
		private authService: AuthService,
		private router: Router,
		@Inject(WINDOW) private window: Window
	) {}

	ngOnInit() {
		this.userIsAuth = this.authService.getIsAuth()
		this.authListenerSubs = this.authService
			.getAuthStatusListener()
			.subscribe(isUserAuth => {
				this.userIsAuth = isUserAuth
			})
		this.window.addEventListener('scroll', this.userScroll.bind(this))
		console.log('Initial scrollY:', this.window.scrollY);
		console.log('Window height:', this.windowHeight);
	}

	ngOnDestroy() {
		if (this.authListenerSubs) {
			this.authListenerSubs.unsubscribe()
		}
		if (this.routerEventsSub) {
			this.routerEventsSub.unsubscribe()
		}
		this.window.removeEventListener('scroll', this.userScroll.bind(this))
	}

	toggleMobileNav() {
		console.log('toggle mobile nav called')

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

	userScroll() {
		if (this.mobileMenuOpen && this.window.scrollY >= this.windowHeight) {
			console.log('here you go')
			this.toggleMobileNav()
		}
	}

}

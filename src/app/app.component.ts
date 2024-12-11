import { Component, OnInit } from '@angular/core'
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router'

import { HttpClientModule } from "@angular/common/http"

import { AuthService } from "./auth/auth.service";

import {NavbarComponent} from "./layout/navbar/navbar.component";
import {FooterComponent} from "./layout/footer/footer.component";
import {ToastComponent} from "./layout/toast/toast.component";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterModule,
		RouterOutlet,
		HttpClientModule,
		NavbarComponent,
		FooterComponent,
		ToastComponent
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
	title = 'wharmy';

	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.authService.autoAuthUser()
	}

}

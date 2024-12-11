import { Component } from '@angular/core'
import { FormsModule, NgForm } from "@angular/forms"
import { Router } from "@angular/router"

@Component({
	selector: 'app-search-bar',
	standalone: true,
	imports: [
		FormsModule
	],
	templateUrl: './search-bar.component.html',
	styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
	constructor(
		private router: Router
	) {}

	searchSubmit(form: NgForm) {
		this.router.navigate(['/search-results'], {
			queryParams: { query: form.value.search }
		})
	}
}

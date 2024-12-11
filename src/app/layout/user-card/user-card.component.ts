import {Component, Input} from '@angular/core'
import { RouterLink } from "@angular/router"

import { DividerComponent } from "../divider/divider.component"

@Component({
	selector: 'app-user-card',
	standalone: true,
	imports: [
		RouterLink,
		DividerComponent
	],
	templateUrl: './user-card.component.html',
	styleUrl: './user-card.component.css'
})
export class UserCardComponent {
	@Input() username!: string | undefined
	@Input() memberNumber!: number | undefined
	@Input() armiesCount!: number
	@Input() miniaturesCount!: number
}

import { Component, Input } from '@angular/core'
import {NgClass} from "@angular/common";

@Component({
	selector: 'app-dropdown',
	standalone: true,
	imports: [
		NgClass
	],
	templateUrl: './dropdown.component.html',
	styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
	@Input() iconUrl: string = '../../../assets/icons/game-icons_spiral-arrow.svg'
	@Input() collapsed: boolean = false

	clickHandler() {
		this.collapsed = !this.collapsed
	}

}

import { Component, Input } from '@angular/core'
import { NgIf } from "@angular/common"
import { RouterLink } from "@angular/router"

import { ArmyInterface } from "../../../../models/army.interface"

@Component({
	selector: 'app-army-card',
	standalone: true,
	imports: [
		RouterLink,
		NgIf
	],
	templateUrl: './army-card.component.html',
	styleUrl: './army-card.component.css',
})
export class ArmyCardComponent {
	@Input() army: ArmyInterface | undefined
}

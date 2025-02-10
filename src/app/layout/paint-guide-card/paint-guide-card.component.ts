import { Component, Input } from '@angular/core'
import { RouterLink } from "@angular/router"
import { NgFor, NgIf } from "@angular/common"

import { PaintGuideInterface } from "../../models/paint-guide.interface"

@Component({
	selector: 'app-paint-guide-card',
	standalone: true,
	imports: [
		RouterLink,
		NgIf,
		NgFor
	],
	templateUrl: './paint-guide-card.component.html',
	styleUrls: [
		'./paint-guide-card.component.css',
	]
})
export class PaintGuideCardComponent {
	@Input() paintGuide: PaintGuideInterface | undefined
}

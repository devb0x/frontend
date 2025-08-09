import { Component, Input } from '@angular/core'
import { ActivatedRoute, Router } from "@angular/router"
import { NgFor, NgIf } from "@angular/common"

import { PaintGuideInterface } from "../../models/paint-guide.interface"

@Component({
	selector: 'app-paint-guide',
	standalone: true,
	imports: [
		NgIf,
		NgFor
	],
	templateUrl: './paint-guide.component.html',
	styleUrl: './paint-guide.component.css'
})
export class PaintGuideComponent {
	constructor(
		private router: Router,
		private route: ActivatedRoute
	) {}

	@Input() paintGuideId = ''
	paintGuide$: PaintGuideInterface | null = null

	ngOnInit() {
		this.route.data.subscribe(({ paintGuideData }) => {
			if (!paintGuideData) {
				console.warn("No paint guide found.");
			} else {
				console.log('Resolved paint guide:', paintGuideData);
				this.paintGuide$ = paintGuideData;
			}
		});
	}

	hasValidPaints(paintsUsed: any): boolean {
		if (!Array.isArray(paintsUsed)) return false;

		// Flatten all subarrays and check if any item is not an empty string or "[]"
		const flat = paintsUsed.flat();
		return flat.some(paint => paint && paint !== '[]');
	}

}

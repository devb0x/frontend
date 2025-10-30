import { Component } from '@angular/core'
import { NgFor, NgIf } from "@angular/common"

import { SpinnerComponent } from "../../layout/spinner/spinner.component"
import { PaintGuideCardComponent } from "../../layout/paint-guide-card/paint-guide-card.component"

import { PaintGuideService } from "../../services/paint-guide.service"
import {PaintGuideInterface} from "../../models/paint-guide.interface"
import {HttpErrorResponse} from "@angular/common/http"

@Component({
	selector: 'app-paint-guides',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		SpinnerComponent,
		PaintGuideCardComponent
	],
	templateUrl: './paint-guides.component.html',
	styleUrl: './paint-guides.component.css'
})
export class PaintGuidesComponent {
	constructor(private paintGuideService: PaintGuideService) {}

	paintGuides: PaintGuideInterface[] = []
	isLoading:boolean = false

	ngOnInit() {
		this.isLoading = true

		this.paintGuideService
			.getAllPaintGuides()
			.subscribe(
				(paintGuides: any) => {
					this.paintGuides = paintGuides
					this.isLoading = false
					console.log(this.paintGuides)
				},
				(error: HttpErrorResponse) => {
					console.error(error)
					this.isLoading = false
				}
			)
	}
}

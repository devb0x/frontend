import { Component } from '@angular/core'
import { HttpErrorResponse } from "@angular/common/http"
import { RouterLink } from "@angular/router"
import { NgFor, NgIf } from "@angular/common"

import { PaintGuideService } from "../../../services/paint-guide.service"

import { PaintGuideInterface } from "../../../models/paint-guide.interface"

import { SpinnerComponent } from "../../../layout/spinner/spinner.component"
import { PaintGuideCardComponent } from "../../../layout/paint-guide-card/paint-guide-card.component"
import { OverlayMenuComponent } from "../../../layout/overlay-menu/overlay-menu.component"

@Component({
	selector: 'app-paint-guide-list',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		RouterLink,
		SpinnerComponent,
		PaintGuideCardComponent,
		OverlayMenuComponent
	],
	templateUrl: './paint-guide-list.component.html',
	styleUrl: './paint-guide-list.component.css'
})
export class PaintGuideListComponent {
	constructor(private paintGuideService: PaintGuideService) {}

	isLoading: boolean = false
	paintGuides: PaintGuideInterface[] = []

	ngOnInit() {
		const ownerId: string | null = localStorage.getItem('userId')
		if (!ownerId) {
			return
		}

		this.isLoading = true
		this.paintGuideService
			.getUserPaintGuide(ownerId)
			.subscribe(
				(paintGuides: any) => {
					this.paintGuides = paintGuides
				},
				(error: HttpErrorResponse) => {
					console.error(error)
					this.isLoading = false
				}
			)
		this.isLoading = false
	}
}

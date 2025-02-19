import { Component } from '@angular/core'
import { NgIf, NgFor } from "@angular/common"
import { HttpErrorResponse } from "@angular/common/http"

import { ArmyService } from "../../../services/army.service"
import { ArmyInterface } from '../../../models/army.interface'

import { ArmyCardComponent } from "../../../layout/army-card/army-card.component"
import { SpinnerComponent } from "../../../layout/spinner/spinner.component"
import { OverlayMenuComponent } from "../../../layout/overlay-menu/overlay-menu.component"

@Component({
	selector: 'app-army-list',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		ArmyCardComponent,
		SpinnerComponent,
		OverlayMenuComponent
	],
	templateUrl: './army-list.component.html',
	styleUrl: './army-list.component.css'
})
export class ArmyListComponent {
	constructor(private armyService: ArmyService) {}

	armies: ArmyInterface[] = []
	isLoading: boolean = false

	ngOnInit() {
		const userId: string | null = localStorage.getItem('userId')
		if (!userId) {
			return
		}
		this.isLoading = true

		this.armyService
			.getUserArmies(userId)
			.subscribe(
				(armies: any) => {
					this.armies = armies
				},
				(error: HttpErrorResponse) => {
					console.error(error)
					this.isLoading = false
				}
			)
		this.isLoading = false
	}

}

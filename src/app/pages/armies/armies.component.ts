import { Component } from '@angular/core'
import { NgIf, NgFor } from "@angular/common"

import { ArmyInterface } from "../../models/army.interface"
import { ArmyService } from "../../services/army.service"

import { SpinnerComponent } from "../../layout/spinner/spinner.component"
import { ArmyCardComponent } from "../../layout/army-card/army-card.component"
import {HttpErrorResponse} from "@angular/common/http";

@Component({
	selector: 'app-armies',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		SpinnerComponent,
		ArmyCardComponent
	],
	templateUrl: './armies.component.html',
	styleUrls: [
		'./armies.component.css',
		'../dashboard/army-list/army-list.component.css'
	]
})
export class ArmiesComponent {
	constructor(private armyService: ArmyService) {}

	armies: ArmyInterface[] = []
	isLoading: boolean = false

	ngOnInit() {
		this.isLoading = true

		this.armyService
			.getAllArmies()
			.subscribe(
				(armies: any) => {
					this.armies = armies
					this.isLoading = false
				},
				(error: HttpErrorResponse) => {
					console.error(error)
					this.isLoading = false
				}
			)
	}
}

import {Component, Input, Output} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {ArmyService} from "../dashboard/army-list/army.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgFor, NgIf} from "@angular/common";
import {ArmyInterface} from "../../models/army.interface";

import { DropdownComponent } from "../../layout/dropdown/dropdown.component"
import {ImageUploadComponent} from "./army-edit/image-upload/image-upload.component";
import {MiniatureCardComponent} from "../miniature/miniature-card/miniature-card.component";
import {ConfirmationModalComponent} from "../../layout/confirmation-modal/confirmation-modal.component";

@Component({
	selector: 'app-army',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		DropdownComponent,
		RouterLink,
		ImageUploadComponent,
		MiniatureCardComponent,
		ConfirmationModalComponent
	],
	templateUrl: './army.component.html',
	styleUrl: './army.component.css'
})
export class ArmyComponent {
	constructor(
		private router: Router,
		private armyService: ArmyService,
	) {}

	@Input() armyId = ''

	army$: ArmyInterface | null = null
	editLink: boolean = false
	armyIdToDelete: string = this.army$?._id || ''
	miniatureIdToDelete?: string = '' || undefined

	ngOnInit() {
		const userId = localStorage.getItem("userId")

		if (this.armyId) {
			this.armyService
				.getArmy(this.armyId)
				.subscribe(
					(army: any) => {
						this.army$ = army
						if (army.ownerId === userId) {
							this.editLink = true
							console.warn(this.army$)
						}
					},
					(error: HttpErrorResponse) => {
						console.error(error)
					}
				)
		} else {
			console.error("Army ID is missing or invalid")
		}

	}

	deleteArmy(armyId: string) {
		this.armyIdToDelete = armyId
	}

	deleteMiniature(miniatureId?: string) {
		this.miniatureIdToDelete = miniatureId
	}

	onDeleteConfirm(armyId: string) {
		this.armyService
			.deleteArmy(armyId)
			.subscribe(
				(response) => {
					console.log('Delete successful', response);
					this.armyIdToDelete = ''
					console.log('Reset armyIdToDelete:', this.armyIdToDelete);
					// setTimeout(() => {
						this.router.navigate(['/dashboard']);
					// }, 500);
				},
				(error) => {
					console.log('Error deleting army', error);
				}
			);
	}

	onDeleteMiniatureConfirm(armyId: string, miniatureId: string) {
		console.log('armyId = ', armyId, 'miniatureId = ', miniatureId)
		this.armyService
			.deleteMiniature(armyId, miniatureId)
			.subscribe(
				(response) => {
					console.log('Delete successful', response)
					this.miniatureIdToDelete = ''
					this.router.navigate(['/dashboard'])
				},
				(error) => {
					console.log('Error deleting miniature', error)
				}
			)
	}

	onDeleteCancel() {
		this.armyIdToDelete = ''
		this.miniatureIdToDelete = ''
	}

}

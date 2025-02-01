import {Component, Input, Output} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {ArmyService} from "../dashboard/army-list/army.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgFor, NgIf} from "@angular/common";

import {ArmyInterface} from "../../models/army.interface";
import {ToastService} from "../../services/toast.service";

import { DropdownComponent } from "../../layout/dropdown/dropdown.component"
import {ImageUploadComponent} from "./army-edit/image-upload/image-upload.component";
import {MiniatureCardComponent} from "../miniature/miniature-card/miniature-card.component";
import {ConfirmationModalComponent} from "../../layout/confirmation-modal/confirmation-modal.component";
import {OverlayMenuComponent} from "../../layout/overlay-menu/overlay-menu.component";

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
		ConfirmationModalComponent,
		OverlayMenuComponent
	],
	templateUrl: './army.component.html',
	styleUrl: './army.component.css'
})
export class ArmyComponent {
	constructor(
		private router: Router,
		private armyService: ArmyService,
		private toastService: ToastService
	) {}

	@Input() armyId = ''

	army$: ArmyInterface | null = null
	editLink: boolean = false
	armyIdToDelete: string = this.army$?._id || ''
	miniatureIdToDelete?: string = '' || undefined

	ngOnInit() {
		const expirationDateString = localStorage.getItem("expirationDate")
		const userId = localStorage.getItem("userId")
		let edit: boolean = false

		if (expirationDateString) {
			const expirationDate: Date = new Date(expirationDateString)
			const expirationTimeStamp = expirationDate.getTime()
			const now = new Date()
			const currentDate = now.getTime()

			edit = expirationTimeStamp >= currentDate
		}

		if (this.armyId) {
			this.armyService
				.getArmy(this.armyId)
				.subscribe(
					(army: any) => {
						this.army$ = army
						if (army.ownerId._id === userId && edit) {
							this.editLink = true
							console.warn(this.army$)
						}
					},
					(error: HttpErrorResponse) => {
						console.error(error)
						return this.router.navigate(['/404'])
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
					this.toastService.showSuccess("Army successfully deleted !")
					return this.router.navigate(['/dashboard']);
				},
				(error) => {
					console.log('Error deleting army', error)
					this.toastService.showError("Error deleting the army..")
					this.armyIdToDelete = ''
				}
			);
	}

	onDeleteMiniatureConfirm(armyId: string, miniatureId: string) {
		this.armyService
			.deleteMiniature(armyId, miniatureId)
			.subscribe(
				(response) => {
					console.log('Delete successful', response)
					this.miniatureIdToDelete = ''
					return this.router.navigate(['/dashboard'])
				},
				(error) => {
					console.log('Error deleting miniature', error)
					this.miniatureIdToDelete = ''
				}
			)
	}

	onDeleteCancel() {
		this.armyIdToDelete = ''
		this.miniatureIdToDelete = ''
	}

}

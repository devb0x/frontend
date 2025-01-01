import { Component, Input } from '@angular/core'
import { Router, RouterLink } from "@angular/router"
import { NgIf } from "@angular/common"

import { ArmyInterface } from "../../models/army.interface"
import { ArmyService } from "../../pages/dashboard/army-list/army.service"
import { ToastService } from "../../services/toast.service"

import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component"

@Component({
	selector: 'app-overlay-menu',
	standalone: true,
	imports: [
		RouterLink,
		NgIf,
		RouterLink,
		ConfirmationModalComponent
	],
	templateUrl: './overlay-menu.component.html',
	styleUrl: './overlay-menu.component.css'
})
export class OverlayMenuComponent {
	@Input() army!: ArmyInterface

	isMenuOpen: boolean = false
	armyIdToDelete: string = this.army?._id || ''

	constructor(
		private armyService: ArmyService,
		private toastService: ToastService,
		private router: Router,
	) {}

	ngOnInit() {
		// console.log(this.army)
	}

	openOverlayMenu() {
		this.isMenuOpen = !this.isMenuOpen
	}

	deleteArmy(armyId: string) {
		this.armyIdToDelete = armyId
	}

	onDeleteConfirm(armyId: string) {
		this.armyService
			.deleteArmy(armyId)
			.subscribe(
				(response) => {
					console.log('Delete successful', response)
					this.armyIdToDelete = ''
					this.toastService.showSuccess("Army successfully deleted !")
					this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
						return this.router.navigate(['/dashboard']);
					})
				},
				(error) => {
					console.log('Error deleting army', error)
					this.toastService.showError("Error deleting the army..")
					this.armyIdToDelete = ''
				}
			)
	}

	onDeleteCancel() {
		this.armyIdToDelete = ''
	}
}

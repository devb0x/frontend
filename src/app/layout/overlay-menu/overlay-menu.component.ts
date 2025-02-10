import { Component, Input } from '@angular/core'
import { Router, RouterLink } from "@angular/router"
import { NgIf } from "@angular/common"

import { ArmyInterface } from "../../models/army.interface"
import { ArmyService } from "../../services/army.service"
import { ToastService } from "../../services/toast.service"

import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component"
import { MiniatureInterface } from "../../models/miniature.interface"
import { PaintGuideInterface } from "../../models/paint-guide.interface"
import { PaintGuideService } from "../../services/paint-guide.service"

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
	@Input() miniature!: MiniatureInterface
	@Input() paintGuide!: PaintGuideInterface

	isMenuOpen: boolean = false
	armyIdToDelete: string = this.army?._id || ''
	miniatureIdToDelete: string = this.miniature?._id || ''
	paintGuideIdToDelete: string = this.paintGuide?._id || ''

	constructor(
		private armyService: ArmyService,
		private paintGuideService: PaintGuideService,
		private toastService: ToastService,
		private router: Router,
	) {}

	openOverlayMenu() {
		this.isMenuOpen = !this.isMenuOpen
	}

	deleteArmy(armyId: string) {
		this.armyIdToDelete = armyId
	}

	deleteMiniature(miniatureId: any) {
		this.miniatureIdToDelete = miniatureId
	}

	deletePaintGuide(paintGuideId: any) {
		this.paintGuideIdToDelete = paintGuideId
	}

	onDeleteConfirm(armyId: string) {
		this.armyIdToDelete = ''
		this.armyService.deleteArmyAndNavigate(armyId, this.toastService, this.router);
	}

	onDeleteMiniatureConfirm(armyId: string, miniatureId: string) {
		this.miniatureIdToDelete = ''
		this.armyService.deleteMiniatureAndNavigate(armyId, miniatureId, this.toastService, this.router)
	}

	onDeletePaintGuideConfirm(paintGuideId: string) {
		this.paintGuideService.deletePaintGuideAndNavigate(paintGuideId, this.toastService, this.router)
	}

	onDeleteCancel() {
		this.armyIdToDelete = ''
		this.miniatureIdToDelete = ''
		this.paintGuideIdToDelete = ''
	}

}

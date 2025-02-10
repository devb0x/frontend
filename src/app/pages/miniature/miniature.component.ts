import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";

import {ArmyService} from "../../services/army.service";
import { MiniatureService } from "../../services/miniature.service"
import {NgIf, NgFor} from "@angular/common";
import {MiniatureInterface} from "../../models/miniature.interface";
import {PictureInterface} from "../../models/picture.interface";
import {ArmyInterface} from "../../models/army.interface";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
	selector: 'app-miniature',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		RouterLink
	],
	templateUrl: './miniature.component.html',
	styleUrl: './miniature.component.css'
})
export class MiniatureComponent {
	miniature!: MiniatureInterface
	army!: ArmyInterface
	armyId!: string
	miniatureId!: string
	editLink: boolean = false

	constructor(
		private armyService: ArmyService,
		private miniatureService: MiniatureService,
		private route: ActivatedRoute,
	) {}

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

		this.armyId = this.route.snapshot.paramMap.get('armyId')!
		this.miniatureId = this.route.snapshot.paramMap.get('miniatureId')!

		console.log(this.miniatureId)

		this.route.data.subscribe(data => {
			this.miniature = data['miniatureData']
			this.army = data['armyData']

			this.miniature.steps.forEach(step => {
				console.log("Step pictures:", step.pictures);
			});

		})
		if (this.army.ownerId._id === userId && edit) {
			this.editLink = true
		}
	}

}

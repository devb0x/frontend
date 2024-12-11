import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";

import {ArmyService} from "../dashboard/army-list/army.service";
import { MiniatureService } from "./miniature.service"
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
		// TODO remove this line after testing
		// http://localhost:4200/army/6720981b009825bb8b80dbe6/miniature/67209bbdbec24b1ebd34fef7
	ngOnInit() {
		const userId = localStorage.getItem("userId")

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
		if (this.army.ownerId === userId) {
			this.editLink = true
		}
	}





}

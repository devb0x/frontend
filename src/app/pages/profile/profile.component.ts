import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {UserService} from "../../services/user.service";
import {ArmyService} from "../dashboard/army-list/army.service";
import {ArmyInterface} from "../../models/army.interface";
import {NgFor, NgIf} from "@angular/common";
import {ArmyCardComponent} from "../dashboard/army-list/army-card/army-card.component";

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		ArmyCardComponent
	],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.css'
})
export class ProfileComponent {
	army$: ArmyInterface[] = []
	userId!: string | null;

	postData: any


	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private userService: UserService,
		private armyService: ArmyService,
	) {}

	ngOnInit() {
		const memberNumber = this.route.snapshot.paramMap.get('memberNumber');

		if (memberNumber) {
			this.userService.getUserIdByMemberNumber(memberNumber).subscribe(
				(user) => {
					this.userId = user?.userId || null
					if (this.userId) {
						this.fetchArmyData()
					}
				},
				(err) => {
					console.error('Error fetching user ID:', err);
				},
			);
		}
	}

	fetchArmyData(): void {
		if (this.userId) {
			this.armyService.getArmyByMemberNumber(this.userId).subscribe(
				data => {
					this.army$ = data;
					console.log(data)
				},
				error => {
					console.error('Error fetching army data:', error);
				}
			);
		}
	}
}

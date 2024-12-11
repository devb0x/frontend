import { Component } from '@angular/core'
import { NgIf, NgFor } from "@angular/common"
import {ActivatedRoute, RouterLink} from "@angular/router"

import {forkJoin, Observable} from "rxjs"

import { SearchService } from "../../services/search.service"

import {MiniatureInterface} from "../../models/miniature.interface";
import {ArmyInterface} from "../../models/army.interface";
import {UserInterface} from "../../models/user.interface";

import { ArmyCardComponent } from "../dashboard/army-list/army-card/army-card.component";
import { MiniatureCardComponent } from "../miniature/miniature-card/miniature-card.component";
import { UserCardComponent } from "../../layout/user-card/user-card.component";

@Component({
	selector: 'app-search-results',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		RouterLink,
		ArmyCardComponent,
		MiniatureCardComponent,
		UserCardComponent
	],
	templateUrl: './search-results.component.html',
	styleUrls: [
		'./search-results.component.css'
		]
})
export class SearchResultsComponent {
	query = ''
	armies: ArmyInterface[] = []
	miniatures: MiniatureInterface[] = []
	users: UserInterface[] = []

	constructor(
		private activatedRoute: ActivatedRoute,
		private searchService: SearchService
	) {}

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe(params => {
			const query = params['query']; // Access the 'query' parameter
			this.query = query

				const searchObservables = [
					this.searchService.searchArmies(query),
					this.searchService.searchMiniatures(query),
					this.searchService.searchUsers(query)
				]

			forkJoin(searchObservables).subscribe(
				([armies, miniatures, users]) => {
					this.armies = armies as ArmyInterface[]
					this.miniatures = miniatures as MiniatureInterface[]
					this.users = users as UserInterface[]
					console.log(this.users)
				},
				(error) => {
					console.error('Error fetching search results:', error);
				}
			)
		});

	}

}

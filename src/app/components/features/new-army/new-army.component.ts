import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgFor, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {CardComponent} from "../../../layout/card/card.component";
import {DropdownComponent} from "../../../layout/dropdown/dropdown.component";
import {HttpClient} from "@angular/common/http";
import {DashboardService} from "../../../pages/dashboard/dashboard.service";

@Component({
  selector: 'app-new-army',
  standalone: true,
  imports: [
		RouterLink,
		ReactiveFormsModule,
		NgIf,
		NgFor,
		CardComponent,
		DropdownComponent
	],
  templateUrl: './new-army.component.html',
  styleUrl: './new-army.component.css'
})
export class NewArmyComponent {
	armyForm!: FormGroup;
	currentStep: number = 1

	universes: any[] = []
	alliances: string[] = [];
	factionData: any[] = []; // To store the fetched faction data
	groupedFactions: { [key: string]: any[] } = {}; // To store factions by alliance dynamically

	constructor(
		private fb: FormBuilder,
		private http: HttpClient,
		private router: Router,
		private dashboardService: DashboardService
	) {}

	ngOnInit(): void {
		this.armyForm = this.fb.group({
					universe: ['', Validators.required],
					faction: ['', Validators.required],
					name: ['', Validators.required]
		})
		this.fetchUniverseData()
	}

	fetchUniverseData(): void {
		this.http.get<any>('assets/faction-options.json').subscribe((data) => {
			this.universes = data.universes;  // Store fetched universes data
		});
	}


	fetchFactionData(): void {
		this.http.get<any>('assets/faction-options.json').subscribe((data) => {
			const selectedUniverse = this.armyForm.get('universe')?.value;
			console.log('Selected universe:', selectedUniverse);

			if (data[selectedUniverse]) {
				const universeData = data[selectedUniverse];
				this.groupedFactions = this.groupFactionsByAlliance(universeData.factions);
				this.alliances = universeData.alliances;  // Set alliances dynamically
				console.log(`${selectedUniverse} factions grouped by alliance:`, this.groupedFactions);
			} else {
				console.log('No matching data for the selected universe.');
			}
		});
	}


	groupFactionsByAlliance(data: any): any {
		const grouped: any = {}

		data.forEach((faction: any) => {
			const alliance = faction.alliance;
			if (!grouped[alliance]) {
				grouped[alliance] = [];
			}
			grouped[alliance].push(faction);
		});

		return grouped;
	}

	nextStep() {
		this.currentStep++
	}

	onUniverseChange(value: string): void {
		this.armyForm.patchValue({ universe: value });
		console.log('Selected universe:', value);
		this.fetchFactionData(); // Fetch the faction data when the universe changes
	}

	onFactionChange(value: string): void {
		this.armyForm.patchValue({faction: value })
	}

	formatUniverseName(universe: string): string {
		const ignoreWords = ['of']; // Array of words to ignore
		return universe
			.replace(/_/g, ' ') // Replace hyphens with spaces
			.split(' ') // Split into words
			.map(word => {
				// Capitalize the first letter of each word unless it's in the ignore list
				if (ignoreWords.includes(word.toLowerCase())) {
					return word.toLowerCase(); // Keep 'of' in lowercase
				}
				return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize
			})
			.join(' '); // Join the words back together
	}

	onSubmit(): void {
		if (this.armyForm.valid) {
			const userId: string | null = localStorage.getItem('userId')
			this.armyForm.value.universe = this.formatUniverseName(this.armyForm.value.universe)

			if (userId) {
				this.dashboardService
					.createNewArmy(
						this.armyForm.value.universe,
						this.armyForm.value.faction,
						this.armyForm.value.name
					)
					.subscribe(
						(response) => {
							console.log(response)
						},
						(error) => {
							console.log(error)
						}
					)
			}
			this.router.navigate(['/dashboard']).then(() => {
				this.armyForm.reset()
				this.currentStep = 1
			})
		}
	}

}

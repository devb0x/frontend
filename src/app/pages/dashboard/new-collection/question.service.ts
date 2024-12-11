import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"

import {map, Observable, of} from "rxjs"

import { QuestionBase } from "./question-base"
import { DropdownQuestion } from "./question-dropdown"
import { TextboxQuestion } from "./question-textbox"
import {CardSelectionQuestion} from "./question-cardselection";

interface FactionOption {
	key: string;
	value: string;
}

@Injectable()
export class QuestionService {
	step = 1
	public maxStep = 0

	constructor(private http: HttpClient) {}

	getQuestions() {

		const questions: QuestionBase<string>[] = [

			new CardSelectionQuestion({
				key: 'category',
				label: 'Category',
				options: [
					{key: 'age_of_sigmar', value: 'Age of Sigmar', logo: 'assets/logos/AoS-logo.webp'},
					{key: 'warhammer_40K', value: 'Warhammer 40K', logo: 'assets/logos/40k-logo.webp'},
					// {key: 'middle-earth', value: 'Middle-Earth', logo: ''}
				],
				required: true,
				order: 1,
				step: 1
			}),

			// new DropdownQuestion({
			// 	key: 'subCategory',
			// 	label: 'Faction',
			// 	options: [],
			// 	required: true,
			// 	order: 2,
			// 	step: 2
			// }),

			new CardSelectionQuestion({
				key: 'subCategory',
				label: 'Faction',
				options: [],
				required: true,
				order: 2,
				step: 2
			}),

			new TextboxQuestion({
				key: 'name',
				label: 'Collection name',
				required: true,
				order: 3,
				step: 3
			})
		]

		this.maxStep = questions.length

		return of(questions.sort((a, b) => a.order - b.order))
	}

	getFactionOptions(category: string): Observable<FactionOption[]> {
		return this.http.get<{ [key: string]: FactionOption[] }>('../../assets/faction-options.json')
			.pipe(
				map(options => {
					// remove the space by _ for matching the JSON data
					const formattedCategory = category.replace(/\s+/g, '_').toLowerCase();
					return options[formattedCategory] || [];
				})
			)
	}

	getMaxStep() {
		return this.maxStep
	}

	getStep() {
		return this.step
	}
}
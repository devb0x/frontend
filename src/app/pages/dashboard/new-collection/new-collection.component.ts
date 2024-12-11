import { Component } from '@angular/core'
import {AsyncPipe} from "@angular/common";

import {DynamicFormComponent} from "./dynamic-form.component";

import {QuestionBase} from "./question-base";
import {QuestionService} from "./question.service";
import {Observable} from "rxjs";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-new-army',
	standalone: true,
	imports: [
		RouterLink,
		AsyncPipe,
		DynamicFormComponent
	],
	// template: `
  //   <div>
  //     <app-dynamic-form [questions]="questions$ | async"></app-dynamic-form>
  //   </div>
  // `,
	providers: [QuestionService],
	templateUrl: './new-collection.component.html',
	// styleUrl: './new-army.component.css'
})
export class NewCollectionComponent {
	questions$: Observable<QuestionBase<any>[]>

	constructor(service: QuestionService) {
		this.questions$ = service.getQuestions()
	}
}

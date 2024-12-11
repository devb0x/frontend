import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {QuestionBase} from "./question-base";
import {DropdownComponent} from "../../../layout/dropdown/dropdown.component";

@Component({
	standalone: true,
	selector: 'app-question',
	templateUrl: './dynamic-form-question.component.html',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		DropdownComponent
	],
	styleUrl: './dynamic-form-question.component.css'
})
export class DynamicFormQuestionComponent {
	@Input() question!: QuestionBase<any>
	@Input() form!: FormGroup

	@Input() filteredOptions: any[] = [];

	ngOnInit() {
		if (this.question.options) {
			this.filteredOptions = this.question.options.filter(opt => opt.alliance === 'chaos');
		}
	}

	// ngOnInit() {
	// 	if (this.question.options) {
	// 		const alliances = ['order', 'chaos', 'destruction', 'death'];
	//
	// 		// Loop over alliances and filter the options dynamically
	// 		this.allianceDropdowns = alliances.map(alliance => {
	// 			return {
	// 				title: alliance.charAt(0).toUpperCase() + alliance.slice(1),  // Capitalize the title
	// 				options: this.question.options.filter(opt => opt.alliance === alliance)
	// 			};
	// 		});
	// 	}
	// }

	// ngOnInit() {
	// 	if (this.question.options) {
	// 		// Use dynamic filtering logic here
	// 		this.filteredOptions = this.question.options.filter(opt => opt.alliance === this.selectedAlliance); // selectedAlliance is passed in dynamically
	// 	}
	// }



	get isValid() {
		return this.form.controls[this.question.key].valid
	}

	isInvalid(controlName: string): boolean {
		const control = this.form.get(controlName);
		return !control || (control?.invalid && (control?.dirty || control?.touched)) || false;
	}



}
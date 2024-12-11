import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'app-card',
	standalone: true,
	imports: [],
	templateUrl: './card.component.html',
	styleUrl: './card.component.css'
})
export class CardComponent {
	@Input() label!: string;
	@Input() imageUrl!: string;
	@Input() value!: string;
	@Input() selectedValue!: string;

	@Output() selectionChange = new EventEmitter<string>();

	selectCard() {
		this.selectionChange.emit(this.value);
	}

	isSelected() {
		return this.selectedValue === this.value;
	}
}

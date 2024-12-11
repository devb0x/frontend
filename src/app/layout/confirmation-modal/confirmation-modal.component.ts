import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
	selector: 'app-confirmation-modal',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './confirmation-modal.component.html',
	styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
	@Input() message: string = 'Are you sure you want to delete this item?';
	@Output() confirmed = new EventEmitter<void>();
	@Output() cancelled = new EventEmitter<void>();

	confirm() {
		this.confirmed.emit();
	}

	cancel() {
		this.cancelled.emit();
	}
}

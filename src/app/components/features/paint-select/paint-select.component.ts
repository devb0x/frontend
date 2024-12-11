import {Component, EventEmitter, Input, Output} from '@angular/core'
import { HttpClient } from "@angular/common/http"
import {NgFor, NgIf} from "@angular/common"

import { PaintInterface } from "../../../models/paint.interface"

@Component({
	selector: 'app-paint-select',
	standalone: true,
	imports: [
		NgFor,
		NgIf
	],
	templateUrl: './paint-select.component.html',
	styleUrl: './paint-select.component.css'
})
export class PaintSelectComponent {
	@Output() paintSelected = new EventEmitter<{ type: string; brand: string; name: string }>();
	@Output() paintRemoved = new EventEmitter<{ type: string; brand: string; name: string }>();
	@Input() selectedPaints: PaintInterface[] = [];

	paints: any[] = []


	constructor(private http: HttpClient) {}

	ngOnInit() {
		this.http
			.get('../assets/paints-list.json')
			.subscribe(
				(data: any) => {
					this.paints = data.paints;
				},
				(error: any) => {
					console.error('Error fetching JSON data:', error);
				}
			);
	}

	addPaintToStep(type: string, brand: string, selectElement: HTMLSelectElement) {
		const selectedPaintName = selectElement.value;

		if (selectedPaintName) {
			this.paintSelected.emit({ type, brand, name: selectedPaintName });
		}
	}


	// Remove paint from the step
	removePaintFromStep(paint: { type: string, name: string, brand: string }) {
		this.paintRemoved.emit(paint)
	}

	savePaintsUsed() {
		console.warn('this btn does nothing except console log')
		console.log('selectedPaints: ', this.selectedPaints)
	}
}

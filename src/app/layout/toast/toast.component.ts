import { Component, OnInit } from '@angular/core';
import {NgIf, NgClass} from "@angular/common";

import { Subscription } from 'rxjs';

import { ToastService } from '../../services/toast.service';

@Component({
	selector: 'app-toast',
	standalone: true,
	imports: [
		NgIf,
		NgClass
	],
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
	message: string | null = null;
	type: string = '';

	private toastSubscription!: Subscription;

	constructor(private toastService: ToastService) {}

	ngOnInit() {
		this.toastSubscription = this.toastService.toastState.subscribe(toast => {
			this.message = toast.message;
			this.type = toast.type;

			// setTimeout(() => {
			// 	this.message = null;
			// }, 3000); // Hide after 3 seconds
		});
	}

	ngOnDestroy() {
		this.toastSubscription.unsubscribe();
	}
}

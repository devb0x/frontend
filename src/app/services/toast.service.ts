import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ToastService {
	private toastSubject = new Subject<{ message: string, type: string }>()
	private hideTimeout: any

	toastState = this.toastSubject.asObservable();

	showSuccess(message: string, duration = 3000) {
		this.showToast(message, 'success', duration)
	}

	showError(message: string, duration = 3000) {
		this.showToast(message, 'error', duration)
	}

	private showToast(message: string, type: string, duration: number) {
		this.toastSubject.next({ message, type })

		if (this.hideTimeout) {
			clearTimeout(this.hideTimeout)
		}

		this.hideTimeout = setTimeout(() => {
			this.clearToast()
		}, duration)
	}

	private clearToast() {
		this.toastSubject.next({ message: '', type: ''})
	}
}

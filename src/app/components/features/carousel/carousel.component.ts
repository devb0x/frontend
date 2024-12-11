import { Component } from '@angular/core'
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import {NgIf, NgFor, NgClass, NgStyle} from "@angular/common"

import { PictureInterface } from "../../../models/picture.interface"

import { environment } from "../../../../environments/environment"
import {RouterLink} from "@angular/router";

const BACKEND_URL = `${environment.apiUrl}/`

@Component({
	selector: 'app-carousel',
	standalone: true,
	imports: [
		RouterLink,
		NgIf,
		NgFor,
		NgClass,
		NgStyle
	],
	templateUrl: './carousel.component.html',
	styleUrl: './carousel.component.css'
})

export class CarouselComponent {
	miniatures$: PictureInterface[] = []
	currentIndex: number = 0
	currentSlide = 0
	timerWidth: number = 0
	private interval: any = null // Variable to store the interval ID
	isPaused: boolean = false


	constructor(private http: HttpClient) {}

	ngOnInit() {
		return this.http
			.get(BACKEND_URL + 'recent-uploads')
			.subscribe(
				(data: any) => {
					this.miniatures$ = data
					console.log('miniatures from recent uploads: ', this.miniatures$)
				},
				(error: HttpErrorResponse) => {
					console.error(error)
				}
			)
	}

	nextSlide(): void {
		const totalSlides = this.miniatures$.length
		this.currentIndex = (this.currentIndex + 1) % totalSlides
		this.updateCarousel()
	}

	prevSlide(): void {
		const totalSlides = this.miniatures$.length
		this.currentIndex = (this.currentIndex - 1 + totalSlides) % totalSlides
		this.updateCarousel()
	}

	updateCarousel(index?: number): void {
		if (index !== undefined) {
			this.currentIndex = index;
		}
		const carouselInner = document.querySelector('.carousel-inner') as HTMLElement
		const offset = -this.currentIndex * 100
		carouselInner.style.transform = `translateX(${offset}%)`
		this.startTimer()
	}

	startTimer(): void {
		this.timerWidth = 0;

		const background = document.querySelector('.timer-bar') as HTMLElement;

		if (this.interval) {
			clearInterval(this.interval)
		}
		// if (!this.isPaused) {
		// 	this.timerWidth = 0
		// }

		// Reset the width to 0 instantly by temporarily removing the transition
		background.style.transition = 'none'
		background.style.width = '0%'
		// Force a reflow to apply the changes immediately
		background.offsetHeight
		background.style.transition = 'width 1s linear'

		// Start the timer interval
		this.interval = setInterval(() => {
			if (this.isPaused) {
				clearInterval(this.interval);
				return;
			}

			this.timerWidth += 25 // Adjust this value as needed for smooth transition
			if (this.timerWidth > 100) {
				clearInterval(this.interval);
				this.timerWidth = 0
				this.nextSlide()
			}
		}, 1000)
	}

	setImageDisplayed(index: number) {
		this.currentIndex = index
		this.updateCarousel(this.currentIndex)
	}

	pause() {
		this.isPaused =! this.isPaused
		if (!this.isPaused) {
			this.startTimer()
		}
	}

}

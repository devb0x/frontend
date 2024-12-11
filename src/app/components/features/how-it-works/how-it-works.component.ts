import { Component } from '@angular/core';
import {NgFor, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-how-it-works',
	standalone: true,
	imports: [
		NgFor,
		NgIf,
		RouterLink
	],
	templateUrl: './how-it-works.component.html',
	styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
	steps = [
		{
			title: 'Organize your collection',
			description: 'Keep track of all your Warhammer miniatures in one place.',
			icon: `../../../assets/icons/game-icons_jigsaw-box.svg`
		},
		{
			title: 'Showcase Your Armies',
			description: 'Share your beautifully painted armies with the ',
			icon: `../../../assets/icons/game-icons_lovers.svg`,
			link: '/armies',
			linkText: 'community',
			dot: '.'
		},
		{
			title: 'Secure Storage',
			description: 'Safely store images and details of your collection.',
			icon: `../../../assets/icons/game-icons_shield-echoes.svg`
		}
	]
}

import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MiniatureInterface} from "../../../models/miniature.interface";

@Component({
	selector: 'app-miniature-card',
	standalone: true,
	imports: [
		RouterLink,
		NgIf
	],
	templateUrl: './miniature-card.component.html',
	styleUrls: ['./miniature-card.component.css']
})
export class MiniatureCardComponent {
	@Input() link: string[] = []
	@Input() miniature!: MiniatureInterface
}

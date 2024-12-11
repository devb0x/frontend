import { PictureInterface } from "./picture.interface"
import { PaintInterface } from "./paint.interface"

export interface StepInterface {
	_id?: string
	number: number
	title: string
	description: string
	paintsUsed: PaintInterface[]
	pictures: PictureInterface[]
}

export interface MiniatureInterface {
	_id?: string
	ownerId?: string
	armyId?: string
	name: string
	steps: StepInterface[]
	thumbnailUrl?: string
	// paintsUsed?: PaintInterface[]
}
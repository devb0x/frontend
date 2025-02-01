import { PictureInterface } from "./picture.interface"
import { PaintInterface } from "./paint.interface"

export interface MiniatureStepInterface {
	_id?: string
	number: number
	title: string
	description: string
	paintsUsed: PaintInterface[]
	pictures: PictureInterface[]
}

export interface MiniatureInterface {
	_id?: string
	ownerId?: {
		_id: string
		username: string
	}
	armyId?: string
	name: string
	steps: MiniatureStepInterface[]
	thumbnailUrl?: string
}
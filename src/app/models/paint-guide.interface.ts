import { PictureInterface } from "./picture.interface"
import { PaintInterface } from "./paint.interface"

export interface PaintGuideStepInterface {
	_id?: string
	number: number
	stepDescription: string
	paintsUsed?: PaintInterface[]
	pictures?: PictureInterface[]
}

export interface PaintGuideInterface {
	paintsUsed: []
	_id?: string
	ownerId: {
		_id: string
		username: string
	}
	title: string
	steps: PaintGuideStepInterface[]
	thumbnailUrl?: string
}
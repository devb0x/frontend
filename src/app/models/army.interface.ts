import { PictureInterface } from "./picture.interface"
import { MiniatureInterface } from "./miniature.interface"

export interface ArmyInterface {
	_id: string
	ownerId: string
	name: string
	category: string
	subCategory: string
	thumbnailUrl: string
	pictures: PictureInterface[]
	miniatures: MiniatureInterface[]
	lore: string
	description: string
}
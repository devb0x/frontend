import {QuestionBase} from "./question-base";

export class CardSelectionQuestion extends QuestionBase<string> {
	override controlType = 'radio'
}

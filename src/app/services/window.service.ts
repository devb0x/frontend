import { InjectionToken, FactoryProvider } from '@angular/core'

export const WINDOW = new InjectionToken<Window>('WindowToken')

export const windowProvider: FactoryProvider = {
	provide: WINDOW,
	useFactory: () => window
}

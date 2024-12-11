import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import {catchError, Observable, Subject, throwError} from "rxjs"
import { Router } from "@angular/router"

import { AuthDataModel } from "./auth-data.model"

import { environment } from "../../environments/environment"

const BACKEND_URL = `${environment.apiUrl}/user/`

@Injectable({ providedIn: 'root'})
export class AuthService {
	private isAuthenticated = false
	private token!: string
	private tokenTimer: any
	private userId!: string | null
	private authStatusListener = new Subject<boolean>()
	public loginError: boolean = false

	constructor(private http: HttpClient, private router: Router) {}

	createUser(email: string, username: string, password: string) {
		const authData: AuthDataModel = {email: email, username: username, password: password}
		this.http
			.post(BACKEND_URL + "signup", authData)
			.subscribe({
				next: () => this.router.navigate(['/register/verify-account']),
				error: () => {
					this.authStatusListener.next(false)
				}
			})
	}

	isUserExist(email: string) {
		return this.http.get<any>(BACKEND_URL + `userExist?email=${email}`)
	}

	isUsernameTaken(username: string) {
		return this.http.get<any>(BACKEND_URL + `usernameTaken?username=${username}`)
	}

	login(email: string, password: string) {
		const authData: AuthDataModel = {email: email, password: password}
		this.http
			.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + "login", authData)
			.pipe(
				catchError(error => {
					console.log(error.error?.reason)
					if (error.status === 403 && error.error?.reason === "unverified") {
						this.router.navigate(['/register/verify-account'], { queryParams: { email } });
					} else if (error.status === 401) { // 401 for incorrect password
						this.loginError = true
					} else {
						this.loginError = true
					}
					return throwError(error);
				})
			)
			.subscribe(response => {
				this.token = response.token
				if (this.token) {
					const expiresInDuration = response.expiresIn
					this.setAuthTimer(expiresInDuration)
					this.isAuthenticated = true
					this.userId = response.userId
					this.authStatusListener.next(true)
					const now = new Date()
					const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
					this.saveAuthData(this.token, expirationDate, this.userId as string)
					this.router.navigate(['/dashboard']).then(() => {})
				}
			})
	}

	logout() {
		this.token = null as any
		this.isAuthenticated = false
		this.authStatusListener.next(false)
		this.userId = null as any
		clearTimeout(this.tokenTimer)
		this.clearAuthData()
		this.router.navigate(['/'])	}

	private saveAuthData(token: string, expirationDate: Date, userId: string) {
		localStorage.setItem("token", token)
		localStorage.setItem("expirationDate", expirationDate.toISOString())
		localStorage.setItem("userId", userId)
	}

	private clearAuthData() {
		localStorage.removeItem("token")
		localStorage.removeItem("expirationDate")
		localStorage.removeItem("userId")
	}

	private setAuthTimer(duration: number) {
		this.tokenTimer = setTimeout(() => {
			this.logout()
		}, duration * 10000)
	}

	private getAuthData() {
		const token = localStorage.getItem("token")
		const expirationDate = localStorage.getItem("expirationDate")
		const userId = localStorage.getItem("userId")
		if (!token || !expirationDate) {
			return null
		}
		return {
			token: token,
			expirationDate: new Date(expirationDate),
			userId: userId
		}

	}

	getAuthStatusListener() {
		return this.authStatusListener.asObservable()
	}

	autoAuthUser() {
		const authInformation = this.getAuthData()
		if (!authInformation) {
			return
		}
		const now = new Date()
		const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
		if (expiresIn > 0) {
			this.token = authInformation.token
			this.isAuthenticated = true
			this.userId = authInformation.userId
			this.setAuthTimer(expiresIn / 1000)
			this.authStatusListener.next(true)
		}
	}

	getIsAuth() {
		const token = localStorage.getItem("token")
		const userId = localStorage.getItem("userId")
		const expirationDate = localStorage.getItem("expirationDate")

		if (!token || !userId || !expirationDate) {
			this.clearAuthData()
			return false
		}

		const expirationDateObj = new Date(expirationDate)
		return expirationDateObj.getTime() > Date.now()
	}
}


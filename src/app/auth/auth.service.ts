import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { BehaviorSubject, Subject } from "rxjs";
import { Router } from "@angular/router";

import { environment } from "src/environments/environment";

const USERS_URL = environment.apiUrl + 'users/'
const SIGNUP_URL = USERS_URL + 'signup'
const LOGIN_URL = USERS_URL + 'login'

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    private token: string
    private authStatusSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false)
    public authStatus$ = this.authStatusSubject$.asObservable()
    private tokenTimeout: NodeJS.Timeout;

    private userIdSubject$: BehaviorSubject<string> = new BehaviorSubject(null)
    public userId$ = this.userIdSubject$.asObservable()

    getToken(): string {
        return this.token
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        }

        this.http.post(SIGNUP_URL, authData).subscribe({
            next: response => {
                console.log(response)
            }
        })
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        }

        this.http.post<{ token: string, expiresIn: number, userId: string }>(LOGIN_URL, authData).subscribe({
            next: response => {
                this.token = response.token
                if (this.token) {
                    this.authStatusSubject$.next(true)
                    this.userIdSubject$.next(response.userId)
                    this.router.navigate(['/']);

                    //  seconds
                    const expiresIn = response.expiresIn;
                    this.setTokenTimeout(expiresIn * 1000)

                    const now = new Date()
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000)
                    this.saveAuthData(this.token, expirationDate, response.userId)
                }
            }
        })
    }

    //  milliseconds
    private setTokenTimeout(duration: number) {
        this.tokenTimeout = setTimeout(() => this.logout(), duration)
    }

    logout() {
        this.token = null
        this.authStatusSubject$.next(false)
        this.userIdSubject$.next(null)
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimeout)
        this.clearAuthData();
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate.toISOString());
        localStorage.setItem("userId", userId)
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("userId");
    }

    autoAuthUser() {
        const authData = this.getAuthData();

        if (!authData) {
            return;
        }

        const now = new Date()
        //  milliseconds
        const duration = authData.expirationDate.getTime() - now.getTime()

        if (duration <= 0) {
            return;
        }

        this.token = authData.token
        this.authStatusSubject$.next(true)
        console.table({authData})
        this.userIdSubject$.next(authData.userId)
        this.setTokenTimeout(duration)
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expirationDate");
        const userId = localStorage.getItem("userId");

        if (!token || !expirationDate || !userId) {
            return
        }

        return {
            token: token, 
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }
}
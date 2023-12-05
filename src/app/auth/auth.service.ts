import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { BehaviorSubject, Subject } from "rxjs";
import { Router } from "@angular/router";

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

    getToken(): string {
        return this.token
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        }

        this.http.post('http://localhost:3000/api/users/signup', authData).subscribe({
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

        this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/users/login', authData).subscribe({
            next: response => {
                this.token = response.token
                if (this.token) {
                    this.authStatusSubject$.next(true)
                    this.router.navigate(['/']);

                    //  seconds
                    const expiresIn = response.expiresIn;
                    this.setTokenTimeout(expiresIn * 1000)

                    const now = new Date()
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000)
                    this.saveAuthData(this.token, expirationDate)
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
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimeout)
        this.clearAuthData();
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
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
        this.setTokenTimeout(duration)
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expirationDate");

        if (!token || !expirationDate) {
            return
        }

        return {
            token: token, 
            expirationDate: new Date(expirationDate)
        }
    }
}
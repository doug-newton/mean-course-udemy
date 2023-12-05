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

                    const expiresIn = response.expiresIn;
                    this.tokenTimeout = setTimeout(() => this.logout(), expiresIn * 1000)
                }
            }
        })
    }

    logout() {
        this.token = null
        this.authStatusSubject$.next(false)
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimeout)
    }
}
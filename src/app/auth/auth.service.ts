import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { response } from "express";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient
    ) { }

    private token: string

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

        this.http.post<{token: string}>('http://localhost:3000/api/users/login', authData).subscribe({
            next: response => {
                this.token = response.token
            }
        })
    }
}
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.scss'
    ]
})
export class LoginComponent {

    constructor(private authService: AuthService) { }

    onLogin(form: NgForm){

        if (form.invalid) {
            return
        }

        this.authService.loginUser(
            form.value.email,
            form.value.password
        )
    }

}
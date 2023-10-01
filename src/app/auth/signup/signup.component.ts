import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
    templateUrl: './signup.component.html',
    styleUrls: [
        './signup.component.scss'
    ]
})
export class SignupComponent {

    onSignup(form: NgForm){
        console.log(form.value)
    }

}
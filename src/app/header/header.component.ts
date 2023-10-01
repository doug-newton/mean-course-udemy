import { Component } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Observable } from "rxjs";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    public isAuthenticated: boolean = false
    public authStatus$ = this.authService.authStatus$

    constructor(
        private authService: AuthService
    ) { }


}
import { NgModule } from "@angular/core";

import { PostListComponent } from "./post-list/post-list.component";
import { PostCreateComponent } from "./post-create/post-create.component";
import { AngularMaterialModule } from "../angular-material.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [
        PostListComponent,
        PostCreateComponent
    ],
    imports: [
        CommonModule, // required for *ngIf, etc
        RouterModule, // required for the routerLink directive, Router service, etc
        ReactiveFormsModule, // declarative forms
        FormsModule, // template-driven forms
        AngularMaterialModule // material components
    ]
})
export class PostsModule { }
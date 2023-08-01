import { Component, Input, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {

    constructor(public postsService: PostsService) { }

    public posts$ = this.postsService.posts$
}
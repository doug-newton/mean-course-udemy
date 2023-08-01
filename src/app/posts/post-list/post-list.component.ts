import { Component, Input, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

    constructor(public postsService: PostsService) { }

    public posts$ = this.postsService.posts$

    ngOnInit(): void {
        this.postsService.getPosts()
    }

    onDelete(postId: string) {
        this.postsService.deletePost(postId)
    }
}
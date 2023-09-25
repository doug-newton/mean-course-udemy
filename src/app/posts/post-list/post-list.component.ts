import { Component, Input, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material/paginator";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

    constructor(public postsService: PostsService) { }

    totalPosts: number = 10
    postsPerPage: number = 2
    pageSizeOptions = [1, 2, 5, 10]

    public posts$ = this.postsService.posts$

    ngOnInit(): void {
        this.postsService.getPosts()
    }

    onDelete(postId: string) {
        this.postsService.deletePost(postId)
    }

    onChangePage(pageData: PageEvent) {
        console.log(pageData)
    }
}
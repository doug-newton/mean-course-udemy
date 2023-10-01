import { Component, Input, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material/paginator";
import { response } from "express";
import { AuthService } from "src/app/auth/auth.service";
import { Observable } from "rxjs";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

    constructor(public postsService: PostsService, private authService: AuthService) { }

    pageSize: number = 2
    pageIndex: number = 0
    pageSizeOptions = [1, 2, 5, 10]

    public posts$ = this.postsService.posts$
    public totalPosts$ = this.postsService.totalPosts$
    public authStatus$: Observable<boolean> = this.authService.authStatus$

    ngOnInit(): void {
        this.postsService.getPosts(this.pageSize, this.pageIndex)
    }

    onDelete(postId: string) {
        this.postsService.deletePost(postId).subscribe({
            next: response => {
                this.postsService.getPosts(this.pageSize, this.pageIndex)
            }
        })
    }

    onChangePage(pageData: PageEvent) {
        this.pageSize = pageData.pageSize
        this.pageIndex = pageData.pageIndex

        this.postsService.getPosts(this.pageSize, this.pageIndex)
    }
}
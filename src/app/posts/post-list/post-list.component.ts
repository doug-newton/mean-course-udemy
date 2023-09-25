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

    pageSize: number = 2
    pageIndex: number = 0
    pageSizeOptions = [1, 2, 5, 10]

    public posts$ = this.postsService.posts$
    public totalPosts$ = this.postsService.totalPosts$

    ngOnInit(): void {
        this.postsService.getPosts(this.pageSize, this.pageIndex)
    }

    onDelete(postId: string) {
        this.postsService.deletePost(postId)
    }

    onChangePage(pageData: PageEvent) {
        this.pageSize = pageData.pageSize
        this.pageIndex = pageData.pageIndex

        this.postsService.getPosts(this.pageSize, this.pageIndex)
    }
}
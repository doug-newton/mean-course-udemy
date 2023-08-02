import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from '../post.model';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
    postTitle=''
    postContent=''
    post: Post
    private mode = "create"
    private postId: string

    constructor(private postsService: PostsService, public route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = "edit"
                this.postId = paramMap.get('postId')
                this.postsService.getPost(this.postId).subscribe(response => {
                    console.log(response)
                    this.post = {
                        id: response.post._id,
                        title: response.post.title,
                        content: response.post.content,
                    }
                })
            }
            else {
                this.mode = "create"
                this.postId = null
            }
        })
    }

    onSavePost(postForm: NgForm) {
        if (postForm.invalid) return;

        if (this.mode == "create") {

            this.postsService.addPost(
                postForm.value.title,
                postForm.value.content
            )
        }
        else if (this.mode == "edit") {

            this.postsService.updatePost(this.post.id, postForm.value.title, postForm.value.content)
        }

        postForm.resetForm()
    }
}
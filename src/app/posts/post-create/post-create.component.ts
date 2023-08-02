import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from '../post.model';
import { mimeType } from "./mime-type.validator";

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

    form: FormGroup

    imagePreview: string

    constructor(private postsService: PostsService, public route: ActivatedRoute) {
    }

    ngOnInit(): void {

        this.form = new FormGroup({
            title: new FormControl(null, { validators: [Validators.required] }),
            content: new FormControl(null, { validators: [Validators.required] }),
            image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
        })

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = "edit"
                this.postId = paramMap.get('postId')
                this.postsService.getPost(this.postId).subscribe(response => {
                    this.post = {
                        id: response.post._id,
                        title: response.post.title,
                        content: response.post.content,
                    }
                    this.form.setValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: null
                    })
                })
            }
            else {
                this.mode = "create"
                this.postId = null
            }
        })
    }

    onSavePost() {
        if (this.form.invalid) return;

        if (this.mode == "create") {
            this.postsService.addPost(
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            )
        }
        else if (this.mode == "edit") {

            this.postsService.updatePost(this.post.id, this.form.value.title, this.form.value.content)
        }

        this.form.reset()
    }

    onImageSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files[0]
        this.form.patchValue({ image: file })
        this.form.get('image').updateValueAndValidity();
        const fileReader = new FileReader()
        fileReader.onload = () => {
            this.imagePreview = fileReader.result as string
        }
        fileReader.readAsDataURL(file)
    }
}
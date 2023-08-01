import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = []
    public posts$: BehaviorSubject<Post[]> = new BehaviorSubject(this.posts)

    constructor(private http: HttpClient) { }

    getPosts() {
        this.http.get<{message:string, posts: Post[]}>('http://localhost:3000/api/posts').subscribe({
            next: response => {
                console.log(response)
                this.posts = response.posts
                this.posts$.next([...this.posts])
            }
        });
    }

    addPost(title: string, content: string) {
        const post: Post = {
            id: null,
            title: title,
            content: content
        }

        this.posts.push(post);
        this.posts$.next([...this.posts]);
    }
}
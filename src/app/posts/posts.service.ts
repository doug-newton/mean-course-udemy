import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { BehaviorSubject, map } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = []
    public posts$: BehaviorSubject<Post[]> = new BehaviorSubject(this.posts)

    constructor(private http: HttpClient) { }

    getPosts() {
        this.http.get<{message:string, posts: any[]}>('http://localhost:3000/api/posts')
        .pipe(map((response) => {
            return response.posts.map((post) => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                }
            })
        }))
        .subscribe({
            next: posts => {
                console.log(posts)
                this.posts = posts
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

        this.http.post<{ message: string }>('http://localhost:3000/api/posts', post).subscribe({
            next: response => {
                console.log(response)
                this.posts.push(post);
                this.posts$.next([...this.posts]);
            }
        })

    }
}
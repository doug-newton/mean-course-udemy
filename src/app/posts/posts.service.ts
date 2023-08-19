import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { BehaviorSubject, Observable, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = []
    public posts$: BehaviorSubject<Post[]> = new BehaviorSubject(this.posts)

    constructor(private http: HttpClient, private router: Router) { }

    getPosts() {
        this.http.get<{message:string, posts: any[]}>('http://localhost:3000/api/posts')
        .pipe(map((response) => {
            return response.posts.map((post) => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath
                }
            })
        }))
        .subscribe({
            next: posts => {
                this.posts = posts
                this.posts$.next([...this.posts])
            }
        });
    }

    getPost(postId: string): Observable<{
        message: string, post: {
            _id: string, title: string, content: string
        }
    }> {
        return this.http.get<{
            message: string, post: {
                _id: string, title: string, content: string
            }
        }>('http://localhost:3000/api/posts/' + postId);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append("title", title)
        postData.append("content", content)
        postData.append("image", image, title)


        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData).subscribe({
            next: response => {
                const post: Post = {
                    id: response.post.id,
                    title: title,
                    content: content,
                    imagePath: response.post.imagePath
                }
                this.posts.push(post);
                this.posts$.next([...this.posts]);
                this.router.navigate(["/"])
            }
        })
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = {
            id: id,
            title: title,
            content: content,
            imagePath: null
        }

        this.http.put('http://localhost:3000/api/posts/' + id, post)
            .subscribe(response => {
                const updatedPosts = [...this.posts]
                const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.posts$.next([...this.posts])
                this.router.navigate(["/"])
            })
    }

    deletePost(postId: string) {
        this.http.delete<{message: string}>('http://localhost:3000/api/posts/' + postId).subscribe({
            next: response => {
                this.posts = this.posts.filter((post) => post.id !== postId)
                this.posts$.next([...this.posts])
            }
        })
    }
}
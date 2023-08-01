import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { BehaviorSubject, Observable, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { response } from "express";

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

    addPost(title: string, content: string) {
        const post: Post = {
            id: null,
            title: title,
            content: content
        }

        this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post).subscribe({
            next: response => {
                console.log(response)
                post.id = response.postId
                this.posts.push(post);
                this.posts$.next([...this.posts]);
            }
        })
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = {
            id: id,
            title: title,
            content: content
        }

        this.http.put('http://localhost:3000/api/posts/' + id, post)
            .subscribe(response => {
                const updatedPosts = [...this.posts]
                const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.posts$.next([...this.posts])
            })
    }

    deletePost(postId: string) {
        this.http.delete<{message: string}>('http://localhost:3000/api/posts/' + postId).subscribe({
            next: response => {
                console.log(response.message);
                this.posts = this.posts.filter((post) => post.id !== postId)
                this.posts$.next([...this.posts])
            }
        })
    }
}
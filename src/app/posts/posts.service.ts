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
    private totalPosts: number = 0
    public totalPosts$: BehaviorSubject<number> = new BehaviorSubject(0)

    constructor(private http: HttpClient, private router: Router) { }

    getPosts(pageSize: number, pageIndex: number) {
        let queryParams = `?pageSize=${pageSize}&pageIndex=${pageIndex}`

        this.http.get<{ message: string, totalPosts: number, posts: any[] }>('http://localhost:3000/api/posts' + queryParams)
            .pipe(map((response) => {
                return {
                    totalPosts: response.totalPosts,
                    posts: response.posts.map((post) => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            creator: post.creator
                        }
                    })
                }
            }))
            .subscribe({
                next: postData => {
                    this.posts = postData.posts
                    this.posts$.next([...this.posts])
                    this.totalPosts = postData.totalPosts
                    this.totalPosts$.next(this.totalPosts)
                }
            });
    }

    getPost(postId: string): Observable<{
        message: string, post: {
            _id: string, title: string, content: string, imagePath: string
        }
    }> {
        return this.http.get<{
            message: string, post: {
                _id: string, title: string, content: string, imagePath: string
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
                this.router.navigate(["/"])
            }
        })
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        
        let postData: FormData | Post;

        if (typeof(image) == 'object'){
            postData = new FormData()
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        }
        else if (typeof (image) == 'string') {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image
            }
        }

        this.http.put('http://localhost:3000/api/posts/' + id, postData)
            .subscribe(response => {
                this.router.navigate(["/"])
            })
    }

    deletePost(postId: string): Observable<{message:string}> {
        return this.http.delete<{message: string}>('http://localhost:3000/api/posts/' + postId)
    }
}
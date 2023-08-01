import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = []
    public posts$: BehaviorSubject<Post[]> = new BehaviorSubject(this.posts)

    addPost(title: string, content: string) {
        const post: Post = {
            title: title,
            content: content
        }

        this.posts.push(post);
        this.posts$.next([...this.posts]);
    }
}
import { Component } from "@angular/core";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
    posts = [
        { title: 'First Post', content: 'this is first post\'s content' },
        { title: 'Second Post', content: 'this is second post\'s content' },
        { title: 'Third Post', content: 'this is third post\'s content' }
    ]
}
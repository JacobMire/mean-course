import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { PageEvent } from "@angular/material/paginator";
import { Post } from "../posts.model";
import { PostsService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.components.html',
    styleUrl: './post-list.components.css'
})
export class PostListComponent implements OnInit, OnDestroy {
    // posts = [
    //     {title: 'First Post', content: 'first post content'},
    //     {title: 'Second Post', content: 'second post content'},
    //     {title: 'Third Post', content: 'third post content'},
    // ]

    posts: Post[] = [];
    totalPosts = 10;
    postsPerPage = 5;
    currentPage = 1;
    private postsSub: Subscription;


    constructor(public postsService: PostsService) {}

    ngOnInit(){
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[])=>{
            this.posts = posts;
        });
        
        
    }

    onChangedPage(pageData: PageEvent){
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;        
        this.postsService.getPosts(this.postsPerPage,this.currentPage)
    }

    onDelete(postId: string){
        this.postsService.deletePost(postId)
    }

    ngOnDestroy(){
        this.postsSub.unsubscribe();

    }

}
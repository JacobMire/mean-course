import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "./posts.model"
import { Subject } from 'rxjs'
import { map } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {

    }

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{message: string, posts: any}>(
            'http://localhost:3000/api/posts'+ queryParams
        )
        .pipe(map((postData) => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
        }))
        .subscribe((transformedPosts) => {
            this.posts = transformedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    getPost(id: string){
        return this.http.get<{ _id: string, title: string, content: string }>(
            "http://localhost:3000/api/posts/" + id
        );
    }

    addPost(title: string, content: string ) {
        const post: Post = {id: null, title: title, content: content};
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
        .subscribe((responseData)=> {
            const id = responseData.postId
            post.id=id;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
        
    }

    updatePost(id: string, title: string, content: string){
        const post: Post = {id: id, title: title, content: content};
        this.http.put("http://local host:3000/api/posts/"+ id, post)
        .subscribe(response => {
            const updatedPosts = [...this.posts]
            const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        })
    }

    deletePost(postId: string) {
        this.http.delete("http://localhost:3000/api/posts/"+ postId)
        .subscribe(()=> {
            const updatedPosts = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts])
        });

    }
}
import { Component, OnInit } from '@angular/core';
import { PostService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { Post } from '../post.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent  implements OnInit {

posts = [];
isLoading = false;
totalPost = 0;
pageSize = 2;
currentPage = 1;
pageSizeOpt = [1, 2, 5, 10];
 isUserAuth = false;
private userSub: Subscription;
 userId:string;


constructor(private postService: PostService, private authService: AuthService) {}
ngOnInit() {

  this.isLoading = true;
  this.userId=localStorage.getItem("userID");
  console.log(this.userId);
  this.postService.getList(this.pageSize, this.currentPage);

  this.postService.PostListChanged.subscribe(
    (data: { posts: Post[], maxCount: number }) => {
      this.isLoading = false;
      this.posts = data.posts;
      this.totalPost = data.maxCount;
      console.log('sub data.', this.posts);
    }
  )
  this.isUserAuth = this.authService.getIsAuth();
  this.userSub = this.authService.getAuthStatusListner().subscribe((isUserAuthenticated) => {
     this.isUserAuth = isUserAuthenticated;
     this.userId=localStorage.getItem('userId');
   });
}
onDelete(id: string) {
 // console.log("id is:",id);
  this.postService.deletePost(id).subscribe(() => {
    this.postService.getList(this.pageSize, this.currentPage);
  });
}
onChanged(page: PageEvent) {
  console.log(page) ;
  this.currentPage = page.pageIndex + 1  ;
  this.pageSize = page.pageSize;
  this.postService.getList(this.pageSize, this.currentPage);
}
}

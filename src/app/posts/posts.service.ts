import { Injectable, Output } from '@angular/core';
import { Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {environment} from '../../environments/environment';

const Backend_Url=environment.url+"posts"

@Injectable()
export class PostService
{
  constructor(private http: HttpClient,private router: Router,private authService: AuthService){}
  @Output() PostListChanged = new Subject<{posts: Post[]; maxCount: number }>();

postList:any = [];
 getList(pageSize,pageNo)
 {
   const queryParam=`/?pageSize=${pageSize}&pageNo=${pageNo}`;
  // let headers=new HttpHeaders().set('authorization',this.authService.getToken());
  // console.log(headers);

   this.http.get(Backend_Url+queryParam).subscribe(
     (postdata:{posts: Post[], maxCount: number}) =>
     {
      console.log(postdata);
     this.postList = postdata.posts;
      var data =
     {
     posts:this.postList,
     maxCount:postdata.maxCount
     }
      console.log(data);
      this.PostListChanged.next(data);
     }
   );
 }
 addPost(record)
 {
   console.log(record);
 //  let headers=new HttpHeaders().set('authorization',this.authService.getToken());
  // console.log(headers);
   const postData=new FormData();
   postData.append('title',record.title);
   postData.append('desc', record.desc);
   postData.append('image',record.image);
   this.http.post(Backend_Url,postData
   ).subscribe(
     (data) =>
     {
       console.log("post req data is:", data);
       this.router.navigate([""]);
     }
   )
 }
 deletePost(id)
 {
 // let headers=new HttpHeaders().set('authorization',this.authService.getToken());
   return this.http.delete(Backend_Url + '/'+id)
 }
 getPost(id)
 {
   return this.http.get<{_id: string,title: string, desc: string,imgPath:string}>( Backend_Url + '/' + id);
 }
 updatePost(id,post)
 {
 // let headers=new HttpHeaders().set('authorization',this.authService.getToken());
   console.log("ps update");
   let postData:FormData|string;
   if(typeof(post.image)==="object")
   {
    postData=new FormData();
    postData.append("_id",id);
   postData.append('title',post.title);
   postData.append('desc', post.desc);
   postData.append('image',post.image,post.title);
   }
   else
   {
     postData=post;
   }

   this.http.put(Backend_Url +'/'+ id,postData).subscribe((data)=>
   {
     console.log(data);
     this.router.navigate(['']);
   })
 }
}

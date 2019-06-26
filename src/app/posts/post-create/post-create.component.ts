import {Component, OnInit} from '@angular/core';
import { PostService } from '../posts.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../post.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {mimeType} from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit
{
  private mode = "create";
  private postId;
  form: FormGroup;
   post: Post;
   isLoading = false;
   imgPreview:any;

constructor(private postService: PostService, private route: ActivatedRoute)
{}
ngOnInit()
{
  this.form = new FormGroup(
    {
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'desc': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required],asyncValidators: [mimeType]})
    }
  )
  this.route.paramMap.subscribe((param: ParamMap) =>
  {
    if (param.has('postId'))
    {
      console.log("edit mode");
      this.mode = "edit";
      this.postId = param.get('postId');
      console.log(this.postId);
      this.postService.getPost(this.postId).subscribe(data =>
      {
       console.log(data);
       this.post =
       {
         _id: data._id,
        title: data.title,
        desc: data.desc,
        imgPath: data.imgPath,
        creator:null
       }
       this.form.setValue(
        {
          'title': this.post.title,
          'desc': this.post.desc,
          "image":this.post.imgPath
        }
      );
      });

     console.log(this.post);
    }
    else
    {
      this.mode = "create";
      this.postId = null;
    }
  });


}
pickImage(event: Event)
{
  const file = (event.target as HTMLInputElement).files[0]   //typeconversion
  this.form.patchValue(
    {
      image: file
    }
  )
  this.form.get('image').updateValueAndValidity();
 const fileReader = new FileReader();
  fileReader.onload = () =>

{
  this.imgPreview = fileReader.result;

 }
 fileReader.readAsDataURL(file);
}

onAddPost()
{
console.log("add post call");
if(this.form.invalid)
{
  return false;
}
if (this.mode == "create")
{
  const post = {_id: null, title: this.form.value.title, desc: this.form.value.desc,image:this.form.value.image};
  this.postService.addPost(post);
}
else
{
    const post =
    {_id: this.postId, title: this.form.value.title, desc: this.form.value.desc,image:this.form.value.image};
this.postService.updatePost(this.postId, post);

}
this.form.reset();
}
}

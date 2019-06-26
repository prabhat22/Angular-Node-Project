import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { throwError } from 'rxjs';
import { ErrorComponent } from './error/error.component';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor
{
  constructor(private dialog:MatDialog){}

  intercept(req: HttpRequest<any>, next: HttpHandler)
  {

   return next.handle(req).pipe(catchError((err:HttpErrorResponse)=>
   {
     let errorMsg="An unknown error occured!!";
     console.log(err.error.msg);
     if(err.error.msg)
     {
       errorMsg=err.error.msg;
     }
     this.dialog.open(ErrorComponent,{data:{msg:errorMsg}});
     return throwError(err);
   })
   )

  }
}

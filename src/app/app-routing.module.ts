import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.components';
import { PostCreateComponent } from './posts/post-create/post-create.components';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent },
  { path: 'edit/:postId', component: PostCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

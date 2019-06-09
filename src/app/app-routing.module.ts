import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'details/:id', loadChildren: './details/details.module#DetailsPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'tao-ky-hui', loadChildren: './kyhui/tao-ky-hui/tao-ky-hui.module#TaoKyHuiPageModule' },
  { path: 'xem-ky-hui', loadChildren: './kyhui/xem-ky-hui/xem-ky-hui.module#XemKyHuiPageModule' },
  { path: 'tao-phien-hui', loadChildren: './phienhui/tao-phien-hui/tao-phien-hui.module#TaoPhienHuiPageModule' },
  { path: 'xem-phien-hui', loadChildren: './phienhui/xem-phien-hui/xem-phien-hui.module#XemPhienHuiPageModule' },
  // { path: 'new-task-modal', loadChildren: './new-task-modal/new-task-modal.module#NewTaskModalPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

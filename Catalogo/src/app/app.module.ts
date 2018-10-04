import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfesoresComponent } from './profesores/profesores.component';
import { CursosComponent } from './cursos/cursos.component';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { GuardGuard } from './services/guard.guard';
import { AuthenticationService } from './services/authentication.service';
import { IconService } from './services/icon.service';
import { ImagenService } from './services/imagen.service';
import { UserService } from './services/user.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profesores/:id', component: ProfesoresComponent, canActivate: [GuardGuard] },
  { path: 'cursos/:id', component: CursosComponent, canActivate: [GuardGuard] },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfesoresComponent,
    CursosComponent,
    NotFoundComponent,
    LoginComponent,
    RegistroComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    BootstrapModalModule.forRoot({ container: document.body }),
    ImageCropperModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    HttpModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 2000,
      preventDuplicates: true,
    })
  ],
  providers: [GuardGuard, AuthenticationService, IconService, ImagenService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  message: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    if (this.isLogin) {
      this.message = 'تسحيل دخول ...'
    } else {
      this.message = 'اشتراك ...'
    }
    this.loadingCtrl
      .create({ keyboardClose: true, message: this.message })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(
          resData => {
            this.isLoading = false;
            loadingEl.dismiss();
            if (email == 'admin@adam.com') {
              this.authService.isAdmin = true;
              this.router.navigateByUrl('/home/admin/dates');

            }
            else {
              this.authService.isAdmin = false;
              this.router.navigateByUrl('/home/customer');

            }
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'خطا بالاشتراك , جرب مره ثاني';
            if (code === 'EMAIL_EXISTS') {
              message = 'هذا الايميل في منو  ,   لو سمحت   تشترك';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'الايميل مش موجود';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'الكلمي غلط يا كبير';
            }

            this.showAlert(message);
          }
        );
      });
  }


  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'خطا',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}

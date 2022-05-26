import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ProgramService } from './program.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.page.html',
  styleUrls: ['./program.page.scss'],
})
export class ProgramPage implements OnInit {



  isLoading = false;
  private turnSub: Subscription;
  current = -1;
  today: string;

  start: number;
  end: number;

  titles: string[] = ["احد", "ثنين", "ثلاثا", "اربعا", "خميس", "جمعا", "سبت"];
  hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];



  constructor(public datepipe: DatePipe,
    private router: Router,
    private alertCtrl: AlertController,
    private prograSvc: ProgramService,
    private loadingCtrl: LoadingController

  ) {

  }

  ngOnInit() {


  }
  ionViewWillEnter() {
    var d = new Date();
    this.current = d.getDay();
    this.today = this.titles[this.current];

    this.isLoading = true;
    // this.placesService.fetchPlaces().subscribe(() => {
    //   this.isLoading = false;
    // })
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  onsubmit() {


    if (this.start >= this.end || !this.start || !this.end) {
      this.alertCtrl
        .create({
          header: 'خطا',
          message: 'خطا بالساعات ',
          buttons: ['Okay']
        })
        .then(alertEl => alertEl.present());
    } else {
      var arr = [];
      for (var i = 0; i < this.end - this.start; i++) {
        arr.push("");
        arr.push("");
      }

      this.loadingCtrl
        .create({
          message: 'Creating place...'
        })
        .then(loadingEl => {
          loadingEl.present();
          this.prograSvc.addProgram(this.current,
            true,
            arr,
            this.start,
            this.end,
            new Date())
            .subscribe((val) => {
              loadingEl.dismiss();
              console.log(val)
            });
        });

    }

  }


  ngOnDestroy() {
    if (this.turnSub) {
      this.turnSub.unsubscribe();
    }
  }
}

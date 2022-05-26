import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Day } from '../models/day.model';
import { DatePipe } from '@angular/common';
import { DatesService } from './dates.service';
import { PickDateComponent } from '../pick-date/pick-date.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit, OnDestroy {
  isLoading = false;
  isToday = false;

  private datesnSub: Subscription;
  current = -1;
  currentDateTime;
  today: string;
  hours: string[] = [];

  name: string;




  days: Day[];
  currDay: Day;

  titles: string[] = ["احد", "ثنين", "ثلاثا", "اربعا", "خميس", "جمعا", "سبت"];

  constructor(public datepipe: DatePipe, private router: Router,
    private datesSvc: DatesService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
  ) {

  }

  ngOnInit() {


  }
  async ionViewWillEnter() {
    this.isLoading = true;
    await this.datesSvc.fetchDates().subscribe(days => {
      this.isLoading = false;
      this.days = days;

      var d = new Date();
      this.current = d.getDay();
      this.today = this.titles[this.current];
      let k = 0;

      this.datesnSub = this.datesSvc.dates.subscribe(days => {
        this.days = days;

      });


      for (let i = 0; i < this.days.length; i++) {
        {

          if (this.days[i].date.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
            this.isToday = true;
            this.currDay = this.days[i]
          }
        }

        if (this.currDay) {
          for (let i = 0; i < this.currDay.dates.length; i++) {
            if (i % 2 === 0)
              this.hours.push(this.currDay.start + k + ":00")
            else {
              this.hours.push(this.currDay.start + k + ":30")
              k++;
            }
          }
        }

      }

    });

  }

  onEdit(day: any, i: number, slidingItem: IonItemSliding) {
    this.modalCtrl.create({ component: PickDateComponent }).then(modalEl => {
      modalEl.onDidDismiss()
        .then(modalData => {
          console.log(modalData)
          if (!modalData.data) {
            return;
          }
          else {
            this.loadingCtrl
              .create({
                message: 'يتم الحجز ...'
              })
              .then(loadingEl => {
                loadingEl.present();
                this.currDay.dates[i] = modalData.data;
                console.log(this.currDay)
                this.datesSvc.updatePlace(this.currDay.id, this.currDay.dates)
                  .subscribe(() => {
                    loadingEl.dismiss();
                  });
              });
          }
        });
      modalEl.present();
    })
  }

  ngOnDestroy() {
    if (this.datesnSub) {
      this.datesnSub.unsubscribe();
    }
  }
}
function then(arg0: (resultData: any) => void): (reason: any) => PromiseLike<never> {
  throw new Error('Function not implemented.');
}


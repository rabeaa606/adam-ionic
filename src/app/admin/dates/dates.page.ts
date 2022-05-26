import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatesService } from 'src/app/customer/dates.service';
import { Day } from 'src/app/models/day.model';

@Component({
  selector: 'app-dates',
  templateUrl: './dates.page.html',
  styleUrls: ['./dates.page.scss'],
})
export class DatesPage implements OnInit, OnDestroy {
  isLoading = false;
  isToday = false;

  private datesnSub: Subscription;
  current = -1;
  currentDateTime;
  today: string;
  hours: string[] = [];



  days: Day[];
  currDay: Day;

  titles: string[] = ["احد", "ثنين", "ثلاثا", "اربعا", "خميس", "جمعا", "سبت"];

  constructor(public datepipe: DatePipe, private router: Router,
    private datesSvc: DatesService) {

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

  ngOnDestroy() {
    if (this.datesnSub) {
      this.datesnSub.unsubscribe();
    }
  }
}

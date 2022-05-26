import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Day } from '../models/day.model';



interface date {
  day: number,
  iscurrent: boolean,
  dates: string[],
  start: number,
  end: number,
  date: Date,
}



@Injectable({
  providedIn: 'root'
})

export class DatesService {
  private _days = new BehaviorSubject<Day[]>([]);

  firebaseUrl = 'https://ionic-angular-course-6491b-default-rtdb.firebaseio.com';
  get dates() {
    return this._days.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchDates() {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: date }>(
          `${this.firebaseUrl}/dates-maked.json?auth=${token}`
        );
      }),
      map(resData => {
        const days = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            days.push(
              new Day(
                key,
                resData[key].day,
                resData[key].iscurrent,
                resData[key].dates,
                resData[key].start,
                resData[key].end,
                new Date(resData[key].date),
              )
            );
          }
        }
        return days;
        // return [];
      }),
      tap(day => {
        this._days.next(day);
      })
    );
  }

  updatePlace(dateId: string, newdates: string[]) {
    let updatedDates: Day[];
    let fetchedToken: string;

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.dates;
      }),
      take(1),
      switchMap(dates => {
        if (!dates || dates.length <= 0) {
          return this.fetchDates();
        } else {
          return of(dates);
        }
      }),
      switchMap(dates => {
        const updatedDateIndex = dates.findIndex(pl => pl.id === dateId);
        updatedDates = [...dates];
        const oldPlace = updatedDates[updatedDateIndex];
        updatedDates[updatedDateIndex] = new Day(
          oldPlace.id,
          oldPlace.day,
          oldPlace.iscurrent,
          newdates,
          oldPlace.start,
          oldPlace.end,
          oldPlace.date,
        );
        return this.http.put(
          `${this.firebaseUrl}//dates-maked/${dateId}.json?auth=${fetchedToken}`,
          { ...updatedDates[updatedDateIndex], id: null }
        );
      }),
      tap(() => {
        this._days.next(updatedDates);
      })
    );
  }
}

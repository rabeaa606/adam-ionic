import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Day } from 'src/app/models/day.model';


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
export class ProgramService {
  private _dates = new BehaviorSubject<Day[]>([]);
  get dates() {
    return this._dates.asObservable();
  }
  firebaseUrl = 'https://ionic-angular-course-6491b-default-rtdb.firebaseio.com';

  constructor(private authService: AuthService, private http: HttpClient) { }

  addProgram(day: number,
    iscurrent: boolean,
    dates: string[],
    start: number,
    end: number,
    date: Date) {

    let newDay: Day;
    let fetchedUserId: string;
    let generatedId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;

        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        if (!fetchedUserId) {
          throw new Error('No user found!');
        }
        var date = new Date()
        newDay = new Day(
          Math.random().toString(),
          day,
          iscurrent,
          dates,
          start,
          end,
          date
        );
        return this.http.post<{ name: string }>(
          `${this.firebaseUrl}/dates-maked.json?auth=${token}`,
          {
            ...newDay,
            id: null
          }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.dates;
      }),
      take(1),
      tap(dates => {
        newDay.id = generatedId;
        this._dates.next(dates.concat(newDay));
      })
    );
  }

}

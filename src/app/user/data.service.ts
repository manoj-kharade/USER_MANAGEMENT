import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

export interface User {
  USER_ID: number;
  FIRST_NAME: string;
  LAST_NAME: string;
  ADDRESS: string;
  EMAIL: string;
  PHONE: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  allUserList: any = [];
  defaultUser = {
    USER_ID: 1,
    FIRST_NAME: "manoj",
    LAST_NAME: "kharade",
    ADDRESS: "PUNE",
    EMAIL: "manojkharade@gmail.com",
    PHONE: 7689984567
  }
  data = new BehaviorSubject<any>([this.defaultUser])
  constructor() {
  }

  /* This function will get data from upsert component and add to user list and emit user list */
  sendData(data: User) {
    let isAdded: boolean = false;
    if (data.USER_ID === 0) {
      let maxId = this.allUserList.reduce((acc: any, curr: any) => {
        return curr.USER_ID > acc ? curr.USER_ID : acc
      }, 0)
      data.USER_ID = maxId + 1
    }

    if (data) {
      if (this.allUserList.length !== 0) {
        this.allUserList.forEach((ele: any, index: any) => {
          if (ele.USER_ID === data.USER_ID) {
            this.allUserList.splice(index, 1, data);
            isAdded = true;
          }
        })
        if (!isAdded) {
          this.allUserList.push(data);
        }
      }
      else {
        this.allUserList.push(data);
      }
    }
    this.data.next(this.allUserList)
  }

}

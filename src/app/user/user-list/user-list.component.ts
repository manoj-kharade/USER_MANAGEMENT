import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core'
import { NotificationService } from 'src/app/notification/notification.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  userData: any;
  dataSource: any = [];
  @Output() editUser: EventEmitter<any> = new EventEmitter<any>()
  constructor(public dataService: DataService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.dataService.data.subscribe(
      (res: any) => {
        this.dataSource = res
      }
    )
  }

  /* This function will send user data to upsert component to update user */
  onEdit(value: any) {
    this.editUser.emit(value)
  }

  /* This function will delete user from list */
  onDelete(value: any) {
    const element = this.dataSource.filter((ele: any) => {
      return ele.USER_ID == value.USER_ID
    })

    this.dataSource.forEach((ele: any, index: any) => {
      if (element[0].USER_ID === ele.USER_ID) {
        this.dataSource.splice(index, 1);
        this.notificationService.showSuccess("User deleted", "Success")
      }
    })
  }
}

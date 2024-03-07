import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-user-upsert',
  templateUrl: './user-upsert.component.html',
  styleUrls: ['./user-upsert.component.scss']
})
export class UserUpsertComponent implements OnInit {
  userForm: FormGroup;
  allUserList = [];
  duplicate: boolean = false;
  isActionEdit: boolean = false;
  message: string = "User added successfully"
  constructor(private fb: FormBuilder,
    public dataService: DataService,
    private notificationService: NotificationService) {
    this.userForm = this.fb.group({
      USER_ID: [0, [Validators.required]],
      FIRST_NAME: ['', [Validators.required]],
      LAST_NAME: ['', [Validators.required]],
      ADDRESS: ['', [Validators.required]],
      EMAIL: ['', [Validators.required, Validators.email]],
      PHONE: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    })
  }

  ngOnInit(): void {
    this.dataService.data.subscribe(
      (res: any) => {
        this.allUserList = res;
      }
    )
  }

  /* This function will save user and update user data */
  onSubmit() {
    if (this.userForm.valid) {
      this.checkDuplicateRecord();
      if (!this.duplicate) {
        this.dataService.sendData(this.userForm.value)

        if (this.isActionEdit) {
          this.userForm.reset()
          this.notificationService.showSuccess("User updated successfully", "Success");
          this.userForm.controls['USER_ID'].setValue(0);
        }
        else {
          this.userForm.reset()
          this.notificationService.showSuccess("User added successfully", "Success");
          this.userForm.controls['USER_ID'].setValue(0);
        }

      }
      else {
        this.notificationService.showError("User already exists", "failure");
        this.duplicate = false;
      }
    }
    else {
      this.notificationService.showError("Please fill the form correctly", "Failure");
    }
    this.isActionEdit = false;
  }

  /* This function will bind user data to form to update user data */
  onEdit(value: any) {
    this.isActionEdit = true
    this.userForm.patchValue(value)
  }

  /* This function will check does user already exists or not*/
  checkDuplicateRecord() {
    if (!this.isActionEdit) {
      this.allUserList.forEach((ele: any) => {
        if (ele.EMAIL === this.userForm.value.EMAIL || ele.PHONE.toString() === this.userForm.value.PHONE || (ele.FIRST_NAME.toString() === this.userForm.value.FIRST_NAME && ele.LAST_NAME.toString() === this.userForm.value.LAST_NAME)) {
          this.duplicate = true;
        }
      })
    }
  }
}

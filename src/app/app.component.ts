import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from './db.service';
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  employeeForm: FormGroup;
  employeesList: any;
  COLUMN_CHARECTERS = 'characters';
  COLUMN_EMAIL = 'email';
  COLUMN_NAME = 'fullName';
  COLUMN_ADDRESS = 'address';
  COLUMN_PHONE = 'phone';
  idFromStore: any;
  selectedValue: string;
  constructor(public db: DbService, private fb: FormBuilder) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      characters: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
    });
    this.initialize();
  }

  initialize() {
    this.db.init();
    setTimeout(() => {
      this.getAllRecords();
    }, 1000);
  }

  getAllRecords() {
    this.db.getAll(this.db.TABLE_NAME).then((res: any) => {
      console.log(res);
      this.employeesList = res;
    });
  }

  getOneRecord(key: number, value: string) {
    this.idFromStore = null;
    this.db.getSingleRecord(this.db.TABLE_NAME, key).then((res: any) => {
      if (res) {
        this.employeeForm.patchValue({
          address: res['address'],
          characters: res['characters'],
          email: res['email'],
          fullName: res['fullName'],
          phone: res['phone'],
        });
        this.idFromStore = res['_id'];
        this.selectedValue = value;
      }
    });
  }

  updateRecords(id?: number | string) {
    const payload = {
      address: this.controls['address']?.value,
      characters: this.controls['characters']?.value,
      email: this.controls['email']?.value,
      fullName: this.controls['fullName']?.value,
      phone: this.controls['phone']?.value,
      _id: this.idFromStore,
    };
    this.db.update(this.db.TABLE_NAME, payload, '').then((res) => {
      alert(`${this.selectedValue} Updated in IndexedDB`);
      this.idFromStore = null;
      this.selectedValue = '';
      this.getAllRecords();
    });
  }

  private get controls() {
    return this.employeeForm.controls;
  }

  addSingleRecord() {
    const payload = {
      address: this.controls['address']?.value,
      characters: this.controls['characters']?.value,
      email: this.controls['email']?.value,
      fullName: this.controls['fullName']?.value,
      phone: this.controls['phone']?.value,
    };
    console.log('form', this.employeeForm.controls);
    this.db.add(this.db.TABLE_NAME, payload).then((res) => {
      alert(`${this.controls['characters']?.value} added in IndexedDB`);
      this.getAllRecords();
      this.employeeForm.reset();
    });
  }

  onClickDelete(id: number | string, value: string) {
    this.idFromStore = id;
    this.selectedValue = value;
  }

  deleteRecords() {
    this.db.delete(this.db.TABLE_NAME, this.idFromStore).then((res) => {
      alert(`${this.selectedValue} deleted from IndexedDB`);
      this.idFromStore = null;
      this.selectedValue = '';
      this.getAllRecords();
    });
  }

  deleteDB() {
    this.db.deleteDB('idb-my-library').then((res) => {
      this.employeesList = [];
    });
  }

  refresh() {
    window.location.reload();
  }

}

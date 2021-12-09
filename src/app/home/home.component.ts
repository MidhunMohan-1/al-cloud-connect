import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  name: FormControl = new FormControl('', [Validators.required]);
  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  message: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(256),
  ]);
  honeypot: FormControl = new FormControl(''); // we will use this to prevent spam
  submitted: boolean = false; // show and hide the success message
  isLoading: boolean = false; // disable the submit button if we're loading
  responseMessage!: string; // the response message to show to the user

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.form = this.formBuilder.group({
      name: this.name,
      email: this.email,
      message: this.message,
      honeypot: this.honeypot,
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.status == 'VALID' && this.honeypot.value == '') {
      this.form.disable(); // disable the form if it's valid to disable multiple submissions
      var formData: any = new FormData();
      formData.append('name', this.form.get('name')?.value);
      formData.append('email', this.form.get('email')?.value);
      formData.append('message', this.form.get('message')?.value);
      this.isLoading = true; // sending the post request async so it's in progress
      this.submitted = false; // hide the response message on multiple submits
      // Developer Midhun - https://script.google.com/macros/s/AKfycbx5WJHhqT7e0tDiorsWeaVFCnd1LSpkM70zGxj2We2I2Vqma80pRcOxNQReNxHJlAkbGg/exec
      this.http
        .post(
          'https://script.google.com/macros/s/AKfycbw6TgT5qHaM3iIxCj9N7JOyjHTe-j9PVJiHOLVgEDfs_vav4p3Xq7l1NNYsRwFSp_64rg/exec',
          formData
        )
        .subscribe(
          (response) => {
            // choose the response message
            let raw: any = {};
            raw = response;
            if (raw['result'] === 'success') {
              this.responseMessage =
                "Thanks for the message! We'll get back to you soon!";
            } else {
              this.responseMessage =
                'Oops! Something went wrong... Reload the page and try again.';
            }
            this.form.enable(); // re enable the form after a success
            this.submitted = true; // show the response message
            this.isLoading = false; // re enable the submit button
            console.log(response);
          },
          (error) => {
            this.responseMessage =
              'Oops! An error occurred... Reload the page and try again.';
            this.form.enable(); // re enable the form after a success
            this.submitted = true; // show the response message
            this.isLoading = false; // re enable the submit button
            console.log(error);
          }
        );
    }
  }
}

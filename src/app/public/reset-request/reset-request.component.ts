import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/authentication/auth.service';

@Component({
  selector: 'app-reset-request',
  templateUrl: './reset-request.component.html',
  styleUrls: ['./reset-request.component.scss'],
})
export class ResetRequestComponent implements OnInit {
  resetForm!: FormGroup;
  public error = null;
  msg!: string;

  constructor(private authentication: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onRequest() {
    this.authentication.sendPasswordResetLink(this.resetForm.value).subscribe(
      (data) => {
        document.cookie =
          'confirm_email_reset_password=' +
          this.resetForm.value['email'].toLowerCase();
        this.handleResponse(data);
      },
      (error) => {
        if (error.error.message.includes('logged')) {
          this.msg = 'This email is used with social login';
        } else {
          this.msg = 'Email does not exist!';
        }
        this.handleError(error);
      }
    );
  }

  handleResponse(res: any) {
    localStorage.setItem(
      'verifEmail',
      this.resetForm.controls['email'].value.toLowerCase()
    );
    this.resetForm.reset();
    this.router.navigate(['confirm-email']);
  }

  handleError(error: any) {
    this.error = error.error.error;
  }
}

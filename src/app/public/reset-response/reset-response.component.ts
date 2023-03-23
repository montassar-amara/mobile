import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/authentication/auth.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';

@Component({
  selector: 'app-reset-response',
  templateUrl: './reset-response.component.html',
  styleUrls: ['./reset-response.component.scss']
})
export class ResetResponseComponent implements OnInit,OnDestroy {
  token: string = '';
  errorMsg = false;
  resetForm: FormGroup =  new FormGroup({
    email: new FormControl(localStorage.getItem('verifEmail'), Validators.required),
    password: new FormControl('', Validators.required),
    password_confirmation: new FormControl('', Validators.required),
    resetToken: new FormControl(this.token)
  });
  success = false;
  passwordStrength = 0;
  public error = null;
  email = localStorage.getItem('verifEmail')
  isVisiblePassword: boolean = false;
  passwordType: 'password' | 'text' = 'password';

  constructor(
    private authentication: AuthService,
    private router: Router,
    private route: ActivatedRoute,private storeService:StoreService) { }
  ngOnDestroy(): void {
    this.storeService.updateNotifier(Notifier.NONE)
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
  		this.token = params['token'];
      // this.authentication.getResetPasswordData(this.token).subscribe(res => {
      //   this.resetForm.value.resetToken = this.token;
      //   this.email = res[0].email;
      // })
  	});

  }

  onSubmit() {
    if(this.resetForm.value.password===this.resetForm.value.password_confirmation)
    {
      this.resetForm.controls['resetToken'].setValue(this.token);
      this.resetForm.controls['email'].setValue(this.email);
      this.authentication.changePassword(this.resetForm.value).subscribe(
          data => this.handleResponse(data)
        );
    }else{
      this.errorMsg = true;
    }
  }

  handleResponse(data: any) {
  	this.success = true
  }

  handleError(error: any) {
  }

  onPasswordStrengthChanged($event: any) {
    this.passwordStrength = $event;
  }
  showHidePassword(): void {
    this.isVisiblePassword = !this.isVisiblePassword;
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
  closeIt(){
    this.storeService.updateNotifier(Notifier.NONE)
    this.router.navigate(['auth/login']);
  }
}

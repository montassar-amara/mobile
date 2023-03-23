import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import intlTelInput from 'intl-tel-input';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IUser } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AuthService } from 'src/app/shared/services/authentication/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import countries from 'src/assets/JSONS/phonecodes.json';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ApiService } from '../../../../../shared/services/api/api.service';
import { Notifier } from 'src/app/shared/store/states';
import { StoreService } from 'src/app/shared/services/store.service';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  Avatar: any;
  phoneintl: any;
  codeNotCorrectSMS = ''
  principal!: IUser;
  timeUntilDeletion$!: Observable<number[]>;
  destroy$ = new Subject();
  request: Partial<IUser> & { preview?: SafeUrl; newAvatar?: string } = {};
  filepath = environment.filepath;
  mainForm!: FormGroup;
  changeEmailForm!: FormGroup;
  changePasswordForm!: FormGroup;
  user: IUser;

  userInfoChanged: boolean = false;

  updateEmailStep: number = 0;
  emailExist: boolean = false;

  updateEmailErros: string[] = [];

  emailExistErrorMsg: string = '';
  changePasswordErrorMsg: string = '';
  PasswordConfirmationErrorMsg: string = '';

  codeNotCorrect: boolean = false;
  code: string = '';

  accountRequests: any[] = [];
  delayDeleteAccount: string = '';
  deleteAccountForm!: FormGroup;

  phoneCodes: any[] = [];
  errorMsg = ''
  selectedCountry: string = '';
  displayChangeEmailModal: boolean = false;
  displayCreateNewPasswordModal: boolean = false;
  displayUploadPhotoModal: boolean = false;

  stepPassword: number = 0;

  iti: any;
  phoneDialog=false;
  notifier$ = this.storeService.notifier$;
  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private http: HttpClient,
    private useraccountservice: UserService,
    private storeService: StoreService,private metaInjectorService: MetaInjectorService) {
      this.metaInjectorService.addTag({
        title:'User Settings',
        description:'User Settings ',
        ogDescription:'User Settings ',
        ogUrl:'valpal.io/',
        ogTitle:'User Settings'
      })
    this.mainForm = new FormGroup({
      fullname: new FormControl('', Validators.required),
      displayname: new FormControl('',Validators.required),
      phoneCode: new FormControl('+1'),
      phoneNumber: new FormControl(''),
      email: new FormControl(''),
    });

    this.deleteAccountForm = this.fb.group({
      user_id: [''],
    });

    this.changeEmailForm = new FormGroup({
      email: new FormControl(''),
      new_email: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      new_password: new FormControl(''),
      cnew_password: new FormControl(''),
    });

    this.changePasswordForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      new_password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      cnew_password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.storeService.user$.subscribe((data: any) => {
      this.user = data;
      this.getDeleteAccountRequest(this.user?._id);
      this.deleteAccountForm.controls['user_id'].setValue(this.user?._id);
      this.mainForm.controls['fullname'].setValue(data?.fullname??data?.name);
      this.mainForm.controls['displayname'].setValue(data?.displayname);
      this.mainForm.controls['phoneCode'].setValue(data?.phone_code);
      this.mainForm.controls['phoneNumber'].setValue(data?.phone_number);
      this.mainForm.controls['email'].setValue(data?.email);

      this.changeEmailForm.controls['email'].setValue(data?.email);

      this.phoneCodes = countries.countries;

      setTimeout(() => {
        $('div.iti__selected-dial-code').html(data?.phone_code);
        $('#mobileCode').val(data?.phone_number);

        const countryCode = this.getCountryCodeFromPhoneCode(data?.phone_code);
        $('div.iti__flag-container div.iti__selected-flag div.iti__flag').attr(
          'class',
          `iti__flag iti__${countryCode}`
        );
      }, 100);


      if (this.isSocialUser()) {
        this.changePasswordForm.controls['password'].setValue('password');
      } else {
        this.changePasswordForm.controls['password'].setValue('');
      }
    });
    const input = document.querySelector('#mobileCode');
    this.iti = intlTelInput(input);
    intlTelInput(input, {
      autoHideDialCode: false,
      separateDialCode: true,
      // any initialisation options go here
    });

    const intlWidth = $('div.iti.iti--allow-dropdown').width();
    $('div.iti.iti--allow-dropdown ul.iti__country-list').width(intlWidth);
  }

  test() {}

  getCountryCodeFromPhoneCode(phoneCode: string) {
    const country = this.phoneCodes.filter((_country) => {
      return _country.dial_code == phoneCode;
    });

    return country.length > 0 ? country[0].code.toLowerCase() : 'us';
  }

  showhidepassinputs: boolean[] = [false, false, false, false];
  ShowHidePassword(id: string, index: number) {
    const password = document.querySelector('#' + id);
    const type =
      password.getAttribute('type') === 'password' ? 'text' : 'password';
    //this.showHidePassword = !this.showHidePassword;
    password.setAttribute('type', type);

    this.showhidepassinputs[index] = !this.showhidepassinputs[index];
  }

  SaveMainInfo(changephone=false) {
      let phone_code = $('div.iti__selected-dial-code').html() ?? '';
      let phone_number = $('#mobileCode').val() ?? '';
    if(changephone){
      phone_code = this.tmpCode;
      phone_number = this.tmpPhone;
    }
    

    const payload = {
      fullname: this.mainForm.value.fullname,
      displayname: this.mainForm.value.displayname,
      phone_code: phone_code,
      phone_number: phone_number,
    };

    this.userService.updateMainUserInfo(payload).subscribe((data) => {
      this.storeService.fetchUser()
    });
    this.userInfoChanged = false;
  }

  yourComponentMethodToTreatyCountryChangedEvent(e) {}

  userdataChanged() {
    this.userInfoChanged = true;
  }

  markForDeletion() {
    this.principal.avatar = undefined;
    this.request.preview = undefined;
    this.request.newAvatar = undefined;
  }

  AvatarSelected(event: any) {
    this.Avatar = <File>event.target.files[0];
    this.imageChangedEvent = event;
    setTimeout(() => {
      // document.getElementById('openProfileUploadModalButton').click();
      this.displayUploadPhotoModal = true;
    }, 400);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  saveCroppedImage() {
    this.apiService
      .uploadProfileAvatarBase64(this.croppedImage)
      .subscribe((res) => {
        this.storeService.fetchUser()
      });
  }
  imageLoaded(image: LoadedImage) {
    this.http
      .post(
        environment.api + 'profileAvatarUpload',
        { avatar: this.croppedImage },
        {}
      )
      .subscribe((res) => {
        this.user.avatar = this.croppedImage;
        this.storeService.fetchUser()
      });
  }

  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  updateAvatar(event) {
    const file = <File>event.target.files[0];
    this.request.preview = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(file)
    );
    const fd = new FormData();
    fd.append('image', file, file.name);
    this.http
      .post(environment.api + 'profileAvatarUpload/', fd, {})
      .subscribe((res) => {
        this.storeService.fetchUser()
      });
  }

  deleteAvatar() {
    this.http
      .post(environment.api + 'deleteProfileAvatar', {})
      .subscribe((res) => {
        this.storeService.fetchUser()
        this.request.preview = undefined;
        this.user.avatar = null;
      });
  }

  next() {
    if (this.updateEmailStep < 2) {
      this.updateEmailStep++;
    }
  }

  verifEmailExist() {
    this.http
      .get(
        environment.api +
          'verifPasswordCorrect/' +
          this.changeEmailForm.value.new_email,
        {}
      )
      .subscribe((res) => {
        if (res === 1) {
          this.emailExist = true;
        } else {
          this.code = '';
          const chars = '0123456789';
          const l = 6;
          let randomstring = '';
          for (let i = 0; i < l; i++) {
            const rnum = Math.floor(Math.random() * chars.length);
            randomstring = randomstring + chars.substring(rnum, rnum + 1);
          }
          this.code = this.code + randomstring;

          this.http
            .post(environment.api + 'saveEmailVerifCode', {
              email: this.changeEmailForm.value.new_email,
              code: this.code,
            })
            .subscribe((res) => {
              this.emailExist = false;
              this.updateEmailStep++;
            });
        }
      });
  }

  updateEmailVerification() {
    this.http
      .post(
        environment.api + 'updateEmailVerification',
        this.changeEmailForm.value,
        {}
      )
      .subscribe(
        (data) => {
          this.emailExist = false;
          this.updateEmailStep++;
        },
        (error) => {
          this.emailExist = true;
          this.updateEmailErros[0] = error.error['user'];
          this.updateEmailErros[1] = error.error['error'];
        }
      );
  }

  onCodeCompleted(code: string) {
    this.http
      .get(
        environment.api + 'verifCode/' + this.changeEmailForm.value.new_email + '/' + code
      )
      .subscribe((res) => {
        if (res['code'].toString() === code) {
          alert('code correct');
          this.http
            .post(
              environment.api + 'changeCurrentEmail',
              this.changeEmailForm.value,
              {}
            )
            .subscribe((data) => {
              this.storeService.fetchUser()
              this.updateEmailStep++;
              this.codeNotCorrect = false;
            });
        } else {
          this.codeNotCorrect = true;
        }
      });
    //this.step++;
  }

  getPasswordTitle() {
    // return this.isSocialUser() ? 'Create a password' : 'Change Password';
    return 'Set a password';
  }

  changePassword() {
    this.stepPassword = 0;
    this.displayCreateNewPasswordModal = true;
  }
  updatePassword() {
    this.changePasswordForm.value.email = this.user.email;
    this.changePasswordForm.value.new_password !==
    this.changePasswordForm.value.cnew_password
      ? (this.PasswordConfirmationErrorMsg = 'Passwords do not match')
      : (this.PasswordConfirmationErrorMsg = '');

    if (this.PasswordConfirmationErrorMsg === '') {
      const old_password = this.changePasswordForm.value.password;
      const new_password = this.changePasswordForm.value.new_password;
      const new_password_confirmation =
        this.changePasswordForm.value.cnew_password;

      const payload = {
        old_password,
        new_password,
        new_password_confirmation,
      };

      this.apiService.updatePassword(payload).subscribe(
        (data) => {
          this.changePasswordErrorMsg = '';
          this.stepPassword++;
        },
        (error) => {
          this.changePasswordErrorMsg = error.error['error'];
        }
      );
    }
  }

  getDeleteAccountRequest(id: string) {
    this.useraccountservice.getDeleteAccountRequest(id).subscribe((res) => {
      this.accountRequests = res;
      if (this.accountRequests.length !== 0) {
        //let created_at = Date.parse(this.accountRequests[0].created_at);

        const d = new Date(this.accountRequests[0].created_at);

        d.setDate(d.getDate() + 7);

        const after7Days = Date.parse(d.toString());
        const now = Date.parse(new Date().toString());

        const duration = (after7Days - now) / 1000;

        var seconds = parseInt(duration.toString(), 10);

        var days = Math.floor(seconds / (3600 * 24));
        seconds -= days * 3600 * 24;
        var hrs = Math.floor(seconds / 3600);
        seconds -= hrs * 3600;
        var mnts = Math.floor(seconds / 60);
        seconds -= mnts * 60;

        this.delayDeleteAccount = days + ' Days, ' + hrs + ' Hours';
      }
    });
  }

  deleteAccountRequest() {
    this.useraccountservice
      .deleteAccountRequest(this.deleteAccountForm.value)
      .subscribe(
        (res) => {
          //this.profilerefresh.setMessage('delete account request');
          this.getDeleteAccountRequest(this.user._id);
        },
        (error) => {}
      );
  }
  CancelDeleteAccountRequest() {
    this.useraccountservice
      .CancelDeleteAccountRequest(this.user._id)
      .subscribe((res) => {
        this.getDeleteAccountRequest(this.user._id);
        //this.profilerefresh.setMessage('delete account canceled');
      });
  }

  isSocialUser() {
    return this.user && this.user.auth_provider == 'google';
  }

  showPrivacyModal() {
    this.storeService.updateNotifier(Notifier.ShowPrivacyModal)
  }

  showTermsModal() {
    this.storeService.updateNotifier(Notifier.ShowTermsModal)
  }
  startPhoneUpdate(){
    this.phoneDialog = true;
    this.updateEmailStep=0;
    setTimeout(() => {
      const input = document.querySelector('#mobileCode2');
    this.iti = intlTelInput(input);
    intlTelInput(input, {
      autoHideDialCode: false,
      separateDialCode: true,
      // any initialisation options go here
    });

    const intlWidth = $('div.iti.iti--allow-dropdown').width();
    $('div.iti.iti--allow-dropdown ul.iti__country-list').width(intlWidth);
    }, 100);
  }
  newPhonenumber = ''
  tmpPhone = ''
  tmpCode = ''
  startTimer = false;
  display = '';
  showLoading = false;
  showEmailSent = false;
  phoneEntred(){
    const phone_code = $('.popup-phone').find('div.iti__selected-dial-code').html() ?? '';
    const phone_number = $('#mobileCode2').val() ?? '';
    this.tmpPhone = `${phone_number}`;
    this.tmpCode = `${phone_code}`;
    this.userService.verifyUniquePhone(phone_code,this.tmpPhone).subscribe(res=>{
      if(!res){
        const frame = document.getElementById('myIframe') as HTMLIFrameElement;
    frame.contentWindow.postMessage({type:'sendOtp',phone:this.tmpCode+this.tmpPhone},'*')
    // this.tmpPhone = undefined;
    const next = ()=> this.updateEmailStep = 1;
    const final = ()=> {
      this.SaveMainInfo(true)
      this.phoneDialog = false;
    }
    const error = (msg:string)=>{
      this.codeNotCorrectSMS = msg;
    }
    const error1 = (msg:string)=>{
      this.errorMsg = msg;
    }
    window.onmessage = function(e) {
      if(e.data.type==='otpcheck'){
        if(e.data.result){
          final()
        }else{
          error(e.data.msg)
        }
      }
      if(e.data.type==='otpstart'){
        if(e.data.result){
          next()
        }else{
          error1(e.data.msg)
        }
      }
  };
      }else{
        this.errorMsg = 'This number is used by another account.'
      }
    })
  }
  phoneConfirmed(code: string) {
    const frame = document.getElementById('myIframe') as HTMLIFrameElement;
    frame.contentWindow.postMessage({type:'checkOtp',phone:this.tmpCode+this.tmpPhone,code},'*')
  }
  timer(minute: number) {
    // let minute = 1;
    this.startTimer = true;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.startTimer = false;
        clearInterval(timer);
      }
    }, 1000);
  }
  resendVerifCodePhone(){
    this.showEmailSent = true;
    this.showLoading = false;
    this.codeNotCorrectSMS = '';
    const frame = document.getElementById('myIframe') as HTMLIFrameElement;
    frame.contentWindow.postMessage({type:'sendOtp',phone:this.tmpCode+this.tmpPhone},'*')
    this.timer(10);
  }
}

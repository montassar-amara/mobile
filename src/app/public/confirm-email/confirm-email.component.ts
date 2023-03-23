import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit,OnDestroy {
  startTimer: boolean = false;
  codeNotCorrect = false;
  code =''
  email = localStorage.getItem('verifEmail')
  notifier$ = this.storeService.notifier$
  destroy$ = new Subject()
  constructor(
    private storeService: StoreService,
    private router: Router
  ) { }
  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  ngOnInit(): void {
    this.notifier$.pipe(takeUntil(this.destroy$)).subscribe(ntf=>{
      if(ntf===Notifier.verifyCodeFail){
        // unable to verify code
      }
      if(ntf===Notifier.verifyCodeSuccessful){
        this.router.navigate(['reset-password-response'])
      }
    })
    // const tmp = document.cookie.split(';').find(el=>el.includes('confirm_email_reset_password'))
  }
  emailConfirmed(code: string) {
    this.code = code;
    this.storeService.verifyCode(this.email,code)
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailService } from 'src/app/shared/services/email.service';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;
  showSuccessModal = false
  constructor(private fb: FormBuilder, private emailService: EmailService,private metaInjectorService: MetaInjectorService) {
    this.metaInjectorService.addTag({
      title:'Contact',
      description:'Contact ',
      ogDescription:'Contact ',
      ogUrl:'valpal.io/',
      ogTitle:'Contact'
    })
    
  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      email: ['', Validators.required ],
      name: ['', Validators.required ],
      message: ['', Validators.required ]
      
    });
  }

  contact():void{
     this.emailService.sendEmail(this.contactForm.value).subscribe(()=>{
      this.contactForm.reset()
      this.showSuccessModal = true
     })
  }

}

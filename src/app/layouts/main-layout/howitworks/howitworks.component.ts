import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { IHowItWorks } from 'src/app/shared/models/howitworks';

@Component({
  selector: 'app-howitworks',
  templateUrl: './howitworks.component.html',
  styleUrls: ['./howitworks.component.scss'],
})
export class HowitworksComponent implements OnInit {
  @Input() isLoggedUser = false;
  howItWorks: IHowItWorks[] = [
    {
      img: ['howitworks1.png', 'howitworks1.png', 'howitworks1.png'],
      title: 'Endevalour model',
      text: 'Dui donec diam sed vestibulum convallis porttitor adipiscing vulputate. Donec blandit eu in pellentesque. Purus ac ac diam libero aliquet mollis velit. Quis venenatis duis sit nam vel massa accumsan ipsum aliquam. Tincidunt amet orci purus sit dolor egestas mattis.',
    },
    {
      img: ['howitworks2.png', 'howitworks2.png', 'howitworks2.png'],
      title: 'Hochschild Mining Model',
      text: 'Dui donec diam sed vestibulum convallis porttitor adipiscing vulputate. Donec blandit eu in pellentesque. Purus ac ac diam libero aliquet mollis velit. Quis venenatis duis sit nam vel massa accumsan ipsum aliquam. Tincidunt amet orci purus sit dolor egestas mattis.',
    },
    {
      img: ['howitworks3.png', 'howitworks3.png', 'howitworks3.png'],
      title: 'Create a new model',
      text: 'Dui donec diam sed vestibulum convallis porttitor adipiscing vulputate. Donec blandit eu in pellentesque. Purus ac ac diam libero aliquet mollis velit. Quis venenatis duis sit nam vel massa accumsan ipsum aliquam. Tincidunt amet orci purus sit dolor egestas mattis.',
    },
    {
      img: ['howitworks4.png', 'howitworks4.png', 'howitworks4.png'],
      title: 'Assumption',
      text: 'Dui donec diam sed vestibulum convallis porttitor adipiscing vulputate. Donec blandit eu in pellentesque. Purus ac ac diam libero aliquet mollis velit. Quis venenatis duis sit nam vel massa accumsan ipsum aliquam. Tincidunt amet orci purus sit dolor egestas mattis.',
    },
    {
      img: ['howitworks5.png', 'howitworks5.png', 'howitworks5.png'],
      title: '2 Models',
      text: 'Dui donec diam sed vestibulum convallis porttitor adipiscing vulputate. Donec blandit eu in pellentesque. Purus ac ac diam libero aliquet mollis velit. Quis venenatis duis sit nam vel massa accumsan ipsum aliquam. Tincidunt amet orci purus sit dolor egestas mattis.',
    },
    {
      img: ['howitworks6.png', 'howitworks6.png', 'howitworks6.png'],
      title: 'Model + research report',
      text: 'Dui donec diam sed vestibulum convallis porttitor adipiscing vulputate. Donec blandit eu in pellentesque. Purus ac ac diam libero aliquet mollis velit. Quis venenatis duis sit nam vel massa accumsan ipsum aliquam. Tincidunt amet orci purus sit dolor egestas mattis.',
    },
    {
      img: ['howitworks7.png', 'howitworks7.png', 'howitworks7.png'],
      title: 'Research report',
      text: 'Dui donec diam sed vestibulum convallis porttitor adipiscing vulputate. Donec blandit eu in pellentesque. Purus ac ac diam libero aliquet mollis velit. Quis venenatis duis sit nam vel massa accumsan ipsum aliquam. Tincidunt amet orci purus sit dolor egestas mattis.',
    },
    {
      img: ['howitworks8.png', 'howitworks8.png', 'howitworks8.png'],
      title: 'Chat',
      text: 'Dui donec diam sed vestibulum convallis porttitor adipiscing vulputate. Donec blandit eu in pellentesque. Purus ac ac diam libero aliquet mollis velit. Quis venenatis duis sit nam vel massa accumsan ipsum aliquam. Tincidunt amet orci purus sit dolor egestas mattis.',
    },
  ];
  defaultTouch = { x: 0, y: 0, time: 0 };
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  constructor() {}

  ngOnInit(): void {}


  @HostListener('touchstart', ['$event'])
    //@HostListener('touchmove', ['$event'])
    @HostListener('touchend', ['$event'])
    @HostListener('touchcancel', ['$event'])
    handleTouch(event) {
        let touch = event.touches[0] || event.changedTouches[0];
        // check the events
        if (event.type === 'touchstart') {
            this.defaultTouch.x = touch.pageX;
            this.defaultTouch.y = touch.pageY;
            this.defaultTouch.time = event.timeStamp;
        } else if (event.type === 'touchend') {
            let deltaX = touch.pageX - this.defaultTouch.x;
            let deltaY = touch.pageY - this.defaultTouch.y;
            let deltaTime = event.timeStamp - this.defaultTouch.time;

            // simulte a swipe -> less than 500 ms and more than 60 px
            if (deltaTime < 500) {
                // touch movement lasted less than 500 ms
                if (Math.abs(deltaX) > 60) {
                    // delta x is at least 60 pixels
                    if (deltaX > 0) {
                        this.doSwipeRight(event);
                    } else {
                        this.doSwipeLeft(event);
                    }
                }
            }
        }
    }

    doSwipeLeft(event) {
      //this.carousel.next();
    }

    doSwipeRight(event) {
      //this.carousel.prev();
    }

}

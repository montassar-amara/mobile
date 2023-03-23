import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-post-dropdown',
  templateUrl: './post-dropdown.component.html',
  styleUrls: ['./post-dropdown.component.scss']
})
export class PostDropdownComponent implements OnInit {
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onPin = new EventEmitter();
  @Input() msg='Comment';
  @Input() isPin = false;
  @Input() showPin = false;
  constructor() { }

   ngOnInit(): void {
  }
  edit(){
    this.onEdit.emit()
  }
  delete(){
    this.onDelete.emit()
  }

  pinned() {
    this.onPin.emit()
  }

}

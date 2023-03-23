import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {CompanyService} from "../../../../../../shared/services/company.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Location} from "@angular/common";
import {environment} from "../../../../../../../environments/environment";
import {ImageCroppedEvent, LoadedImage} from "ngx-image-cropper";

import { IUser } from 'src/app/shared/models/user';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-report-widget',
  templateUrl: './create-report-widget.component.html',
  styleUrls: ['./create-report-widget.component.scss']
})
export class CreateReportWidgetComponent implements OnInit, OnDestroy {
  report_id: null

  isFreeCompany = false;
  analysts:IUser[] = []
  selectedAnalyst:IUser = undefined
  company_id = null
  report_data = {
    title: '',
    show_rating: false,
    selected_rating: {
      _id: null,
      name: null,
      value: null
    },
    rating_description: '',
    element_list: []
  }
  rating_list = []

  section_list = []
  show_table_content = true
  show_table_content_for_user = true
  selected_section_index = -1
  selected_element_index = -1
  isFreeReport = false;

  show_image_option_dialog = false;
  display_crop_photo_modal = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  image_section_index = -1
  image_element_index = -1

  filepath = environment.filepath

  constructor(private route: ActivatedRoute,
              private router: Router,
              private companyService: CompanyService,
              private location: Location) { }

  async ngOnInit(): Promise<void> {
    this.analysts = await lastValueFrom(this.companyService.getAnalyst())
    this.route.params.subscribe(data => {
      this.selected_section_index = -1
      this.selected_element_index = -1

      this.company_id = data.company_id
      this.getCompanyData(data.company_id)
    })
  }

  ngOnDestroy() {
  }

  getCompanyData(company_id: string) {
    this.companyService.getOneCompany(company_id).subscribe(res => {
      this.rating_list = []
      this.isFreeCompany = res.is_free;
      this.isFreeReport =  res.is_free;
      this.rating_list = [...this.rating_list, {
        _id: 'overall_rating',
        name: 'Overall Rating',
        value: res.overalRating
      }]
      res.ratings.forEach(rating => {
        this.rating_list = [...this.rating_list, {
          _id: rating._id,
          name: rating.name,
          value: rating.value
        }]
      })
    })
  }

  refreshSelectedRating() {
    if (this.report_data.selected_rating._id) {
      const rating = this.rating_list.find((item) => {
        return item._id === this.report_data.selected_rating._id
      })

      this.report_data.selected_rating = rating
    }

    this.section_list.map((section) => {
      if (section.selected_rating && section.selected_rating._id) {
        const rating = this.rating_list.find((item) => {
          return item._id == section.selected_rating._id
        })

        section.selected_rating = rating
      }
    })
  }

  onTableContent(): void {
    this.show_table_content = !this.show_table_content
  }
  onFreeReport(){
    this.isFreeReport = !this.isFreeReport;
  }
  onAddNewSection(): void {
    this.section_list = [...this.section_list, {
      show_rating: false,
      element_list: []
    }]
  }

  onRemoveSection(index: number): void {
    this.section_list.splice(index, 1);
  }

  onRatingShow(index: number): void {
    this.section_list[index].show_rating = !this.section_list[index].show_rating
  }

  onReportRating(): void {
    this.report_data.show_rating = !this.report_data.show_rating
  }

  onAddNewElement(index: number, type: string): void {
    let section

    if (index == -1) {
      section = this.report_data
    } else {
      section = this.section_list[index]
    }

    if (!section.element_list) {
      section.element_list = []
    }

    let element = {
      type: type,
      content: ''
    }

    if (type == 'grid') {
      element['grid_values'] = []
      for (let i = 0; i < 20; i++) {
        let gv_i = []
        for (let j = 0; j < 20; j++) {
          gv_i = [...gv_i, '']
        }

        element['grid_values'] = [...element['grid_values'], gv_i]
      }
    }


    section.element_list = [...section.element_list, element]
  }

  onAddNewAssetsItem(section_index: number, element_index:number, type: string) {
    let section

    if (section_index == -1) {
      section = this.report_data

    } else {
      section = this.section_list[section_index]
    }

    let element = section.element_list[element_index]

    if (!element.assets_item_list) {
      element.assets_item_list = []
    }

    element.assets_item_list = [...element.assets_item_list, {
      name: '',
      value: '',
      type: type
    }]
  }

  onImageBrowse(section_index, element_index) {
    const image_input = $(`#element-image-${section_index}-${element_index}`)
    $(image_input).trigger('click')
  }

  showImageOption(event, section_index, element_index) {
    this.imageChangedEvent = event;
    this.image_section_index = section_index
    this.image_element_index = element_index

    this.show_image_option_dialog = true;
  }

  cropImage() {
    this.show_image_option_dialog = false;

    setTimeout(() => {
      this.display_crop_photo_modal = true;
    }, 400);
  }

  uploadFullImage() {
    const file = <File>this.imageChangedEvent.target.files[0];
    this.companyService.uploadReportImage(file)
      .subscribe((res) => {
        if (res['success']) {
          if (this.image_section_index == -1) {
            this.report_data.element_list[this.image_element_index].content = res['image']
          } else {
            this.section_list[this.image_section_index].element_list[this.image_element_index].content = res['image']
          }

        } else {
          alert('Image upload failed..')
        }

        this.show_image_option_dialog = false;
      })
  }

  saveCroppedImage() {
    this.companyService.uploadReportImageBas64(this.croppedImage)
      .subscribe(res => {
        if (res['success']) {
          if (this.image_section_index == -1) {
            this.report_data.element_list[this.image_element_index].content = res['image']
          } else {
            this.section_list[this.image_section_index].element_list[this.image_element_index].content = res['image']
          }

        } else {
          alert('Image upload failed..')
        }

        this.display_crop_photo_modal = false;
      })

  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded(image: LoadedImage) {

  }

  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  dropReportElement(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.report_data.element_list, event.previousIndex, event.currentIndex);
  }

  dropSection(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.section_list, event.previousIndex, event.currentIndex);
  }

  dropElement(index: number, section: any, event: CdkDragDrop<string[]>) {
    moveItemInArray(section.element_list, event.previousIndex, event.currentIndex);
    this.section_list[index] = section
  }

  onRemoveElement(section_index: number, element_index: number) {
    let section
    if (section_index == -1) {
      section = this.report_data
    } else {
      section = this.section_list[section_index]
    }

    section.element_list.splice(element_index, 1)
    this.section_list[section_index] = section
  }

  onAssetsItemRemove(section_index: number, element_index: number, item_index: number) {
    let section
    if (section_index == -1) {
      section = this.report_data
    } else {
      section = this.section_list[section_index]
    }

    section.element_list[element_index].assets_item_list.splice(item_index, 1)
  }

  onAddReport(): void {
    const payload = {
      company_id: this.company_id,
      report_data: this.report_data,
      section_list: this.section_list,
      is_free: this.isFreeReport,
      analyst_id:this.selectedAnalyst._id,
      table_content:this.show_table_content_for_user
    }

    this.companyService.addTempReport(payload).subscribe(res => {
      this.location.back()
    })

  }

  onCancel(): void {
    this.location.back()
  }

  onTableSectionSelect(section_index: number): void {
    this.selected_section_index = section_index
    this.selected_element_index = -1

    this.scroll(`section-${section_index}`)
  }

  onTableElementSelect(section_index: number, element_index: number): void {
    this.selected_section_index = section_index
    this.selected_element_index = element_index

    this.scroll(`section-${section_index}-element-${element_index}`)
  }

  scroll(element_id) {
    document.getElementById(element_id).scrollIntoView({behavior: 'smooth'});
  }
  selectAnalyst(user:IUser) {
    this.selectedAnalyst = user
  }

  numSequence(n: number): Array<number> {
    let arr = [];
    for (let i = 0; i < n; i++) {
      arr = [...arr, i];
    }
    return arr;
  }

  getBackgroundColor(i: number, j: number) {
    if (i == 0) {
      return 'rgba(48, 48, 48, 0.3)'

    } else if (i > 0 && j == 0) {
      return 'rgba(190, 212, 235, 0.1)'
    }

    return 'rgba(33, 33, 33, 0.3)'
  }

}

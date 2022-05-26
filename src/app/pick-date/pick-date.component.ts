import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pick-date',
  templateUrl: './pick-date.component.html',
  styleUrls: ['./pick-date.component.scss'],
})
export class PickDateComponent implements OnInit {
  @Output() namePicker = new EventEmitter<string>();

  name: string = '';
  constructor(private modalCtrl: ModalController,
  ) { }

  ngOnInit() { }

  onsubmit() {
    this.namePicker.emit(this.name);
    this.modalCtrl.dismiss(this.name);
  }
}

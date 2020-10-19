import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @ViewChild('checkbox', {static: true}) checkbox: ElementRef;

  @Input() inputModel: boolean;
  @Output() inputModelChange = new EventEmitter<boolean>();

  @Input() text: string;

  constructor() { }

  ngOnInit(): void {
  }

  handleChange(e: any): void {
    const val = e.target.checked
    this.inputModel = val;
    this.inputModelChange.emit(val);
  }
}

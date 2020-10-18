import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() inputModel: boolean;
  @Output() inputModelChange = new EventEmitter<boolean>();

  @Input() text: string;

  constructor() { }

  ngOnInit(): void {
    this.inputModel = true;
  }

  handleChange(e: any) {
    const val = e.target.checked
    this.inputModel = val;
    this.inputModelChange.emit(val);
  }
}

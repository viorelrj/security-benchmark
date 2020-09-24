import { Component, Input, OnInit } from '@angular/core';

import { IFormControl, FormControlType, FormControlHeight, FormControlTheme } from '../shared.interface';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})



export class ButtonComponent implements OnInit, IFormControl {
  @Input() type: FormControlType = 'full';
  @Input() height: FormControlHeight = 'md';
  @Input() theme: FormControlTheme = 'primary';

  constructor() { }

  ngOnInit(): void {
  }

}

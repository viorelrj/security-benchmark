import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { ModalDirective } from './modal/modal.directive';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal/modal.service';
import { CheckboxListComponent } from './checkbox-list/checkbox-list.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ButtonComponent, ModalDirective, ModalComponent, CheckboxListComponent, CheckboxComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ButtonComponent,
    CheckboxListComponent,
    CheckboxComponent,
    ModalComponent
  ],
  providers: [ModalService]
})
export class UiModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { ModalDirective } from './modal/modal.directive';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal/modal.service';


@NgModule({
  declarations: [ButtonComponent, ModalDirective, ModalComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent,
    ModalComponent
  ],
  providers: [ModalService]
})
export class UiModule { }

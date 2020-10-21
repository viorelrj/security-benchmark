import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditorService } from './auditor.service';
import { AuditorComponent } from './auditor.component';


@NgModule({
  declarations: [AuditorComponent],
  imports: [
    CommonModule
  ],
  exports: [AuditorComponent],
  providers: [AuditorService]
})
export class AuditorModule { }

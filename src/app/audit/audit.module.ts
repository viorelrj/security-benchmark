import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditRoutingModule } from './audit-routing.module';

import { AuditComponent } from './audit.component';
import { AuditListComponent } from './audit-list/audit-list.component';

@NgModule({
  declarations: [AuditComponent, AuditListComponent],
  imports: [
    CommonModule,
    AuditRoutingModule
  ]
})
export class AuditModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoliciesRoutingModule } from './policies-routing.module';

import { PoliciesComponent } from './policies.component';
import { PoliciesListComponent } from './policies-list/policies-list.component';
import { PoliciesItemComponent } from './policies-item/policies-item.component';

@NgModule({
  declarations: [PoliciesComponent, PoliciesListComponent, PoliciesItemComponent],
  imports: [
    CommonModule,
    PoliciesRoutingModule
  ]
})
export class PoliciesModule { }

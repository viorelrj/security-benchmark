import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiModule } from '../ui/ui.module';

import { PoliciesRoutingModule } from './policies-routing.module';

import { PoliciesComponent } from './policies.component';
import { PoliciesListComponent } from './policies-list/policies-list.component';
import { PoliciesItemComponent } from './policies-item/policies-item.component';
import { PolicyImportComponent } from './policy-import/policy-import.component';

@NgModule({
  declarations: [PoliciesComponent, PoliciesListComponent, PoliciesItemComponent, PolicyImportComponent],
  imports: [
    CommonModule,
    PoliciesRoutingModule,
    UiModule,
    FormsModule
  ]
})
export class PoliciesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerlRegexService } from './services/perl-regex/perl-regex.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [PerlRegexService]
})
export class CoreModule { }

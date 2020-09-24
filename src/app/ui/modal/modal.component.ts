import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from './modal.directive';

import { ModalChild, ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild(ModalDirective, { static: true }) childContainer: ModalDirective;
  isShown = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.modalService.getModalItem().subscribe((newChild) => this.loadChild(newChild));
    this.modalService.closeModal$.subscribe(() => this.closeModal());
  }

  closeModal() {
    this.isShown = false;
  }

  loadChild(child: ModalChild): void {
    console.log(child);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(child.component);
    const viewContainerRef = this.childContainer.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<ModalChild>(componentFactory);
    componentRef.instance.modalData = child.modalData;

    this.isShown = true;
  }
}

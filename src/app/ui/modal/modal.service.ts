import { EventEmitter, Injectable, Output, Type } from '@angular/core';
import { Subject } from 'rxjs';

export interface IModalChildProps {
  [key: string]: any;
  finalize?: () => void;
}

export class ModalChild {
  constructor(public component: Type<any>, public modalData: IModalChildProps) { }
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  @Output() closeModal$ = new EventEmitter();

  private renderItem$ = new Subject<ModalChild>();

  constructor() { }

  public getModalItem(): Subject<ModalChild> {
    return this.renderItem$;
  }

  showModal(component: Type<any>, props: IModalChildProps): void {
    this.renderItem$.next(new ModalChild(component, props));
  }

  closeModal() {
    this.closeModal$.emit();
  }
}

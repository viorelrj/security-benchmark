import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PolicyFormatterService {
  regexes = {

  }

  constructor() { }

  public format(text: string): Promise<string> {
    text = text.replace(/\t/g, '');

    console.log(text);

    return new Promise<string>(() => {});
  }
}

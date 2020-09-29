import { Injectable } from '@angular/core';

const getTagName = (src: string): string => src.replace(/[<>:/]/g, ' ').trim().split(' ')[0];
const parseAttribute = (src: string): string[] => src.replace(/[:]/g, ' ').replace(/"/g, '').split(' ');


interface IPolicyNode {
  tagName: string;
  attributes?: { [key: string]: string };
  content?: IPolicyNode[] | string[];
}

@Injectable({
  providedIn: 'root'
})
export class PolicyFormatterService {

  constructor() { }

  public format(text: string): Promise<string> {
    text = text.split('\n').filter(line => line.trim()[0] != '#').join('\n');
    const parser = new Parser(text);
    const res = parser.parse()
    console.log(res);


    return new Promise<string>(() => {});
  }
}


class Parser {
  private src: string;
  private nextIndex = 0;

  private regAnyStartTag = new RegExp('<[^/>]{1,}>');
  private regAnyEndTag = new RegExp('<[/][^>]{1,}>');
  private regNamedStartTag = (name: string): RegExp => new RegExp(`<${name}[^>]{0,}>`);
  private regNamedEndTag = (name: string): RegExp => new RegExp(`<[/]${name}[^>]{0,}>`);
  private gReganyAttributeValuePair = /[^\s<]{1,}:"[^"]{1,}"/g

  constructor(src: string) {
    this.src = src;
  }


  private buildSubtree(currIndex: number, lastTag = ''): IPolicyNode[] {
    const res:IPolicyNode[] = [];
    let src = this.src.slice(currIndex, this.src.length);

    let firstEndTag = this.regAnyEndTag.exec(src);
    let firstStartTag = this.regAnyStartTag.exec(src);
    let obj = null as IPolicyNode;

    if (!firstStartTag || !firstEndTag) {
      return [];
    }


    if (src[0] !== '<' && firstEndTag.index < firstStartTag.index) {
      obj = {
        tagName: '__raw__'
      }

      obj.content = [src.slice(0, firstEndTag.index)];
      this.nextIndex += obj.content[0].length + firstEndTag[0].length;

      return [obj];
    }

    while (firstStartTag && firstEndTag && firstStartTag.index < firstEndTag.index) {
      const obj:IPolicyNode = {
        tagName: getTagName(firstStartTag[0])
      }
      const attributeValuePairs = this.gReganyAttributeValuePair.exec(firstStartTag[0]);
      if (attributeValuePairs) {
        for (let i = 0; i < attributeValuePairs.length; i++) {
          obj.attributes = obj.attributes || {};
          const [key, value] = parseAttribute(attributeValuePairs[i]);
          obj.attributes[key] = value;
        }
      }
      
      currIndex += firstStartTag.index + firstStartTag[0].length + 1;
      this.nextIndex = currIndex;
      obj.content = this.buildSubtree(currIndex, getTagName(firstStartTag[0]));
      currIndex = this.nextIndex;
      
      src = this.src.slice(currIndex, this.src.length);

      firstEndTag = this.regAnyEndTag.exec(src);
      firstStartTag = this.regAnyStartTag.exec(src);

      res.push(obj);
    }
    this.nextIndex += (firstStartTag) ? firstStartTag.index : 0;

    return res;
  }
  
  parse(): any {
    return this.buildSubtree(0);
  }
}
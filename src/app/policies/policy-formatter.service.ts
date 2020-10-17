import { Injectable } from '@angular/core';

const getTagName = (src: string): string => src.replace(/[<>:/]/g, ' ').trim().split(' ')[0];
const parseAttribute = (src: string): string[] => src.replace(/[:]/g, '~').replace(/"/g, '').split('~');


export interface IPolicyNode {
  tagName: string;
  attributes?: { [key: string]: string };
  content?: IPolicyNode[] | INessusItem;
}

export interface INessusItem {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class PolicyFormatterService {

  constructor() { }

  public format(text: string): Promise<IPolicyNode> {
    return new Promise<IPolicyNode>((res, rej) => {
      text = text.split('\n').filter(line => line.trim()[0] != '#').join('\n');
      const parser = new Parser(text);
      const result = parser.parse();

      res(result);
    });
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

  private getAttributeValuePairs(src): string[] {
    let temp: unknown;
    const attributeValuePairs = [];
    do {
      temp = this.gReganyAttributeValuePair.exec(src);
      temp && attributeValuePairs.push(temp[0]);
    } while (temp);

    return attributeValuePairs;
  }

  private parseCustomIdem(src: string): INessusItem {
    const regKeyVal = /\S{1,}\s{0,}:\s{0,}(("[^"]{0,}")|(\S{0,}))/g;
    const regKey = /\S{0,}/;
    const regVal = /:\s{0,}(("[^"]{0,}")|(\S{0,}))/

    const ret = {}
    let pair = regKeyVal.exec(src);

    while (pair) {
      const trimQuotes = /^"+|"+$/g;
      const content = pair[0];
      const key = regKey.exec(content)[0];
      const val = regVal.exec(content)[0].substring(1).trim().replace(trimQuotes, '');

      ret[key] = val;

      pair = regKeyVal.exec(src);
    }

    return ret;
  }

  private buildSubtree(currIndex: number, debug?: boolean): IPolicyNode[] {
    const res:IPolicyNode[] = [];
    let src = this.src.slice(currIndex, this.src.length);

    let firstEndTag = this.regAnyEndTag.exec(src);
    let firstStartTag = this.regAnyStartTag.exec(src);
    let obj = null as IPolicyNode;
    
    if (!firstEndTag) {
      return [];
    }
    
    if (src[0] !== '<' && firstEndTag.index < (firstStartTag || {index: firstEndTag.index + 1}).index) {
      obj = {
        tagName: 'nessus_item'
      }

      const content = src.slice(0, firstEndTag.index);
      obj.content = this.parseCustomIdem(content);
      this.nextIndex += content.length + firstEndTag[0].length;

      return [obj];
    }

    if (!firstStartTag) {
      return [];
    }

    while (firstStartTag && firstEndTag && firstStartTag.index < firstEndTag.index) {
      const obj:IPolicyNode = {
        tagName: getTagName(firstStartTag[0])
      }

      const attributeValuePairs = this.getAttributeValuePairs(firstStartTag[0]);
      if (attributeValuePairs) {
        for (let i = 0; i < attributeValuePairs.length; i++) {
          obj.attributes = obj.attributes || {};
          const [key, value] = parseAttribute(attributeValuePairs[i]);
          obj.attributes[key] = value;
        }
      }
      
      currIndex += firstStartTag.index + firstStartTag[0].length + 1;
      this.nextIndex = currIndex; 
      obj.content = this.buildSubtree(currIndex);
      currIndex = this.nextIndex;
      
      src = this.src.slice(currIndex, this.src.length);

      firstEndTag = this.regAnyEndTag.exec(src);
      firstStartTag = this.regAnyStartTag.exec(src);

      res.push(obj);
    }

    const temp = this.src.slice(this.nextIndex, this.src.length).replace(/\n/g, '').trim();
    const _rEnd = this.regAnyEndTag.exec(temp);

    if (_rEnd && _rEnd.index == 0) { // if there is no content, but end tag right away
      this.nextIndex += (firstEndTag) ? firstEndTag.index + firstEndTag[0].length : 0;
    } else if (_rEnd && _rEnd.index !== 0) {
      let potential = res[res.length - 1];
      while (Array.isArray(potential.content) && potential.content.length > 0) {
        potential = potential.content[potential.content.length - 1];
      }
      potential.content = this.buildSubtree(currIndex, true);
    }
    return res;
  }
  
  parse(): any {
    return this.buildSubtree(0);
  }
}
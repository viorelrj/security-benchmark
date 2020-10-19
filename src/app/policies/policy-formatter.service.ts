import { Injectable } from '@angular/core';

const getTagName = (src: string): string => src.replace(/[<>:/]/g, ' ').trim().split(' ')[0];
const parseAttribute = (src: string): string[] => src.replace(/[:]/g, '~').replace(/"/g, '').split('~');

export interface IPolicy {
  checks: {
    [key: string]: INessusItem
  },
  structure: IPolicyNode[]
}

interface IPolicyNode {
  tagName: string;
  attributes?: { [key: string]: string };
  content?: IPolicyNode[];
  description?: string;
}

interface INessusItem {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class PolicyFormatterService {

  constructor() { }

  public format(text: string): Promise<IPolicy> {
    return new Promise<IPolicy>((res, rej) => {
      text = text.split('\n').filter(line => line.trim()[0] != '#').join('\n');
      const parser = new Parser(text);
      const result = parser.parse();

      res(result);
    });
  }

  public filter(content: IPolicy, selected: string[]): Promise<IPolicy> {
    return new Promise<IPolicy>((res, rej) => {
      const result = new Interpreter(content).filter(selected);
      res(result);
    })
  }
}


class Interpreter {
  src: IPolicy;
  checks = {} as {[key: string]: INessusItem}

  constructor(src: IPolicy) {
    this.src = src;
  }

  filter(selected: string[]): IPolicy|null {
    for (const key of selected) {
      this.checks[key] = this.src.checks[key];
    }

    console.log(this.shakeTree(this.src.structure[0]));

    return this.src;
  }

  private shakeTree(current: IPolicyNode): IPolicyNode|null {
    if (current.content && current.content.length) {
      current.content = current.content.map(child => this.shakeTree(child)).filter(item => item !== null);

      current = (current.content && current.content.length)? current : null;
    } else if (current.tagName === 'custom_item') {
      // Remove custom_item if it was not checked
      current = (current.attributes.description && this.checks[current.attributes.description]) ? current : null
    }

    if (current && current.tagName === 'if') {
      // Remove "if" node if there is no condition
      current = (current.content.map(item => item.tagName).includes('condition'))? current : null
    }

    return current;
  }
}

class Parser {
  private src: string;
  private nextIndex = 0;

  private custom_items: {
    [key: string]: INessusItem;
  } = {};

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

  private parseCustomItem(src: string): INessusItem {
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

  private buildSubtree(currIndex: number, isCustomItem?: boolean): IPolicyNode[]|string {
    const res:IPolicyNode[] = [];
    let src = this.src.slice(currIndex, this.src.length);

    let firstEndTag = this.regAnyEndTag.exec(src);
    let firstStartTag = this.regAnyStartTag.exec(src);
    
    if (!firstEndTag) {
      return [];
    }
    
    if (src[0] !== '<' && firstEndTag.index < (firstStartTag || {index: firstEndTag.index + 1}).index) {
      const rawContent = src.slice(0, firstEndTag.index);
      const content = this.parseCustomItem(rawContent);
      const key = content['description'];
      if (isCustomItem && !this.custom_items[key]) {
        this.custom_items[key] = content;
      }

      this.nextIndex += rawContent.length + firstEndTag[0].length;
      return key;
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
      const content = this.buildSubtree(currIndex, obj.tagName === 'custom_item')
      
      if (typeof content === 'string') {
        obj.attributes = {
          ...obj.attributes,
          description: content
        };
      } else {
        obj.content = content
      }
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
      const content = this.buildSubtree(currIndex);
      if (typeof content !== 'string') {
        potential.content = content;
      }
    }
    return res;
  }
  
  parse(): IPolicy {
    const content = this.buildSubtree(0);

    if (typeof content !== 'string') {
      return {
        structure: content,
        checks: this.custom_items
      }
    } else {
      throw 'Parsing error. Has the file been modified?';
    }
  }
}
import { Injectable } from '@angular/core';
import { start } from 'repl';


const getTagName = (src: string): string => src.replace(/[<>:/]/g, ' ').trim().split(' ')[0];
const parseAttribute = (src: string): string[] => src.replace(/[:]/g, ' ').replace(/"/g, '').split(' ');

interface IPolicyNode {
  tagName: string;
  attributes?: { [key: string]: string };
  content?: IPolicyNode[];
}

@Injectable({
  providedIn: 'root'
})
export class PolicyFormatterService {
  private regAnyStartTag = new RegExp('<[^/>]{1,}>');
  private regAnyEndTag = new RegExp('<[/][^>]{1,}>');
  private regNamedStartTag = (name: string): RegExp => new RegExp(`<${name}[^>]{0,}>`);
  private regNamedEndTag = (name: string): RegExp => new RegExp(`<[/]${name}[^>]{0,}>`);
  private gReganyAttributeValuePair = /[^\s<]{1,}:"[^"]{1,}"/g

  constructor() { }

  private parse(src, exitTagName=''): IPolicyNode[] {
    src = src.trim();
    const rStartTag = this.regAnyStartTag.exec(src);
    const rEndTag = this.regAnyEndTag.exec(src);

    const startTag = rStartTag[0];
    const endTag = rEndTag[0];
    const tagName = getTagName(startTag);

    const ret = [];
    
    if (rStartTag.index == 0) {
      const obj:IPolicyNode = {
        tagName: tagName,
        content: []
      };
      
      const attributeValuePairs = this.gReganyAttributeValuePair.exec(startTag);
      if (attributeValuePairs) {
        for (let i = 0; i < attributeValuePairs.length; i++) {
          obj.attributes = obj.attributes || {};
          const [key, value] = parseAttribute(attributeValuePairs[i]);
          
          obj.attributes[key] = value;
        }
      }
      
      src = src.slice(startTag.length+1, src.length);
      obj.content = this.parse(src, tagName);
      ret.push(obj);
    } else if (rEndTag.index < rStartTag.index) {

      ret.push({
        tagName: '__raw__',
        content: src.slice(startTag.length+1, rEndTag.index)
      });
    }

    return ret;
  }

  public format(text: string): Promise<string> {
    text = text.split('\n').filter(line => line.trim()[0] != '#').join('\n');
    console.log(this.parse(text));


    return new Promise<string>(() => {});
  }
}

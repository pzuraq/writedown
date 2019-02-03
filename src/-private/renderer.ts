// import Delta from './delta';
import { TokenType } from './tokenize';
import parse, { WriteDownNode, OpCode } from './parser';
// import objectHash from 'object-hash';

const MARKUP_CONTROLS: { [key: number]: string } = {
  [TokenType.BOLD]: '*',
  [TokenType.CODE]: '`',
  [TokenType.COLOR]: ':',
  [TokenType.ITALIC]: '/',
  [TokenType.MARK]: '::',
  [TokenType.STRIKE]: '~',
  [TokenType.UNDERLINE]: '_',
};

const MARKUP_TAGS: { [key: number]: string } = {
  [TokenType.BOLD]: 'b',
  [TokenType.CODE]: 'code',
  [TokenType.COLOR]: 'span',
  [TokenType.ITALIC]: 'i',
  [TokenType.MARK]: 'mark',
  [TokenType.STRIKE]: 's',
  [TokenType.UNDERLINE]: 'u',
};

const SECTION_TAGS: { [key: number]: string } = {
  [TokenType.PARAGRAPH]: 'p',
  [TokenType.HEADER]: 'h',
  [TokenType.UNORDERED]: '',
  [TokenType.ORDERED]: 'p',
  [TokenType.UNCHECKED]: 'p',
  [TokenType.CHECKED]: 'p',
  [TokenType.ASIDE]: 'aside',
  [TokenType.SEPARATOR]: 'br',
  [TokenType.PRE]: 'pre',
};

function renderAttrs(attrs?: object) {
  return attrs
    ? Object.entries(attrs)
        .map(([k, v]: string[]) => `${k}="${v}"`)
        .join(' ')
    : '';
}

class HtmlRenderer {
  private _renderText: string = '';
  private _renderStack: string[] = [];
  private _openElements: string[] = [];
  private _openMarkups: string[] = [];

  renderNode(node: WriteDownNode) {
    this._renderText = '';

    switch (node.type) {
      case TokenType.ASIDE:
        this._createAside(node);
        break;
      case TokenType.CHECKED:
      case TokenType.UNCHECKED:
        this._createCheckbox(node);
        break;
      case TokenType.HEADER:
        this._createHeading(node);
        break;
      case TokenType.PRE:
        this._createPre(node);
        break;
      case TokenType.ORDERED:
        this._createOrderedListItem(node);
        break;
      case TokenType.UNORDERED:
        this._createUnorderedListItem(node);
        break;
      case TokenType.SEPARATOR:
        this._createSeparator(node);
        break;
      case TokenType.PARAGRAPH:
        this._createParagraph(node);
        break;
      default:
        throw new Error(`unrecognized node type: ${node.type}`);
    }

    return this._renderText;
  }

  _openElement(element: string) {
    this._openElements.push(element);
    this._renderStack.push(this._renderText);
    this._renderText = '';
  }

  _closeElement(attrs?: object) {
    let element = this._openElements.pop();
    let nodeText = `<${element} ${renderAttrs(attrs)}>${this._renderText}</${element}>`;

    this._renderText = this._renderStack.pop() + nodeText;
  }

  _emitElement(element: string, attrs?: object, content?: string) {
    this._renderText += `<${element} ${renderAttrs(attrs)}>${content}</${element}>`;
  }

  _emitText(str: string) {
    this._renderText += str
      .replace(/  /g, ' \u00A0')
      .replace(/  (?=\S)/g, '\u00A0')
      .replace(/ $/, '\u00A0');
  }

  _emitControl(str: string) {
    this._emitElement('span', { class: 'control' }, str);
  }

  _handleOps(node: WriteDownNode) {
    let opPointer = 0;
    let valuePointer = 0;

    for (; opPointer < node.ops.length; opPointer++) {
      let op = node.ops[opPointer];

      if (op === OpCode.APPEND) {
        this._emitText(node.values[valuePointer++]);
      } else if (op === OpCode.OPEN) {
        let type = node.ops[++opPointer];

        if (type === TokenType.LINK) {
          this._openLink();
        } else {
          this._openMarkup(type as TokenType);
        }
      } else if (op === OpCode.CLOSE) {
        let type = node.ops[++opPointer];
        let value;

        if (node.ops[opPointer + 1] === OpCode.VALUE) {
          opPointer++;
          value = node.values[valuePointer++];
        }

        if (type === TokenType.LINK) {
          this._closeLink(value as string);
        } else {
          this._closeMarkup(type as TokenType, value);
        }
      }
    }
  }

  _openMarkup(type: TokenType) {
    let tag = MARKUP_TAGS[type];
    this._openMarkups.push(tag);
    this._openElement(tag);
    this._emitControl(MARKUP_CONTROLS[type]);
  }

  _closeMarkup(type: TokenType, value?: string) {
    this._emitControl(MARKUP_CONTROLS[type]);

    if (typeof value === 'string') {
      this._emitControl(`(${value})`);
    }

    let stackedMarkups = [];
    let tag = this._openMarkups.pop();

    while (tag !== MARKUP_TAGS[type]) {
      if (this._openMarkups.length === 0) {
        throw new Error('attempted to close a markup, but the markup was not open');
      }

      stackedMarkups.push(tag);
      this._closeElement();
      tag = this._openMarkups.pop();
    }

    let attrs;

    if (type === TokenType.MARK || type === TokenType.COLOR) {
      attrs = { class: `color-${value || 'default'}` };
    }

    this._closeElement(attrs);

    while (stackedMarkups.length > 0) {
      let tag = stackedMarkups.pop()!;
      this._openElement(tag);
      this._openMarkups.push(tag);
    }
  }

  _openLink() {
    this._emitControl('[');
    this._openElement('a');
  }

  _closeLink(url: string) {
    this._closeElement({ href: url });
    this._emitControl('](');
    this._openElement('span');
    this._openElement('img');
    this._closeElement({ src: 'inline-link' });
    this._emitText(url);
    this._closeElement({ class: 'link', contenteditable: false });
    this._emitControl(')');
  }

  _createParagraph(node: WriteDownNode) {
    let element = this._openElement('p');

    let beforeLength = this._renderText.length;
    this._handleOps(node);

    if (this._renderText.length === beforeLength) {
      // if (this._currentElement.textContent.length === 0) {
      this._emitElement('br');
    }

    this._emitText('\n');
    this._closeElement();
  }

  _createHeading(node: WriteDownNode) {
    let headingLevel = node.value;

    let element = this._openElement(`h${headingLevel}`);

    let headingText = '';

    for (let i = 0; i < headingLevel; i++) {
      headingText += '#';
    }

    this._emitElement(
      'span',
      { class: `heading-${headingLevel}`, contenteditable: false },
      headingText
    );

    this._emitText(' ');

    this._handleOps(node);

    this._emitText('\n');
    this._closeElement();
  }

  _createAside(node: WriteDownNode) {
    let element = this._openElement('aside');

    this._emitElement('span', { class: 'aside-control' }, '> ');

    this._handleOps(node);

    this._emitText('\n');
    this._closeElement();
  }

  _createUnorderedListItem(node: WriteDownNode) {
    let element = this._openElement('div');

    this._emitElement('span', { class: 'unordered-control' }, '* ');

    this._handleOps(node);

    this._emitText('\n');
    this._closeElement({ class: 'unordered-item' });
  }

  _createOrderedListItem(node: WriteDownNode) {
    let element = this._openElement('div');

    this._emitElement('span', { class: 'ordered-control' }, `${node.value}. `);

    this._handleOps(node);

    this._emitText('\n');
    this._closeElement({ class: 'ordered-item' });
  }

  _createPre(node: WriteDownNode) {
    let element = this._openElement('pre');

    this._emitText(`\`\`\`${node.value}`);

    this._handleOps(node);

    this._emitText('\n```\n');
    this._closeElement();
  }

  _createSeparator(node: WriteDownNode) {
    this._emitElement('hr');
  }

  _createCheckbox(node: WriteDownNode) {}
}

export default new HtmlRenderer();

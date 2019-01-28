import Delta from './delta';
import parse, { SECTION, MARKUP } from './parser';
import objectHash from 'object-hash';

const MARKUP_CONTROLS = {
  [MARKUP.BOLD]: '*',
  [MARKUP.CODE]: '`',
  [MARKUP.COLOR]: ':',
  [MARKUP.ITALIC]: '/',
  [MARKUP.MARK]: '::',
  [MARKUP.STRIKE]: '~',
  [MARKUP.UNDERLINE]: '_',
}

const MARKUP_TAGS = {
  [MARKUP.BOLD]: 'b',
  [MARKUP.CODE]: 'code',
  [MARKUP.COLOR]: 'span',
  [MARKUP.ITALIC]: 'i',
  [MARKUP.MARK]: 'mark',
  [MARKUP.STRIKE]: 's',
  [MARKUP.UNDERLINE]: 'u',
}

class DomRenderer {
  _currentIndex = 0;
  _currentElement = null;

  _cursor = null;
  _selectionRange = null;

  #openElements = [];
  #openMarkups = {
    [MARKUP.BOLD]: false,
    [MARKUP.CODE]: false,
    [MARKUP.COLOR]: false,
    [MARKUP.ITALIC]: false,
    [MARKUP.MARK]: false,
    [MARKUP.STRIKE]: false,
    [MARKUP.UNDERLINE]: false,
  };

  renderNode(node) {
    this._renderText = '';

    switch (node.type) {
      case SECTION.ASIDE:
        return this._createAside(node);
      case SECTION.CHECKED:
      case SECTION.UNCHECKED:
        return this._createCheckbox(node);
      case SECTION.PRE:
        return this._createPre(node);
      case SECTION.HEADER:
        return this._createHeading(node);
      case SECTION.ORDERED:
        return this._createOrderedListItem(node);
      case SECTION.UNORDERED:
        return this._createUnorderedListItem(node);
      case SECTION.SEPARATOR:
        return this._createSeparator(node);
      case SECTION.PARAGRAPH:
        return this._createParagraph(node);
      default:
        throw new Error(`unrecognized node type: ${node.type}`);
    }
  }

  // _openElement(name, attrs) {
  //   let newElement = document.createElement(name);

  //   if (attrs) {
  //     for (let key in attrs) {
  //       newElement.setAttribute(key, attrs[key]);
  //     }
  //   }

  //   if (this._currentElement !== null) {
  //     this._currentElement.appendChild(newElement);
  //   }

  //   this._currentElement = newElement;

  //   return newElement;
  // }

  // _closeElement() {
  //   this._currentElement = this._currentElement.parentElement;
  // }

  _openElement(name, attrs) {
    let attrsString = attrs ? Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ') : '';

    this._renderText += `<${name} ${attrsString}>`;
    this.#openElements.push(name);
  }

  _closeElement() {
    let name = this.#openElements.pop();
    this._renderText += `</${name}>`;
  }

  _emitText(str) {
    let spaceEscaped = str.replace(/  /g, ' \u00A0').replace(/  (?=\S)/g, '\u00A0').replace(/ $/, '\u00A0');

    for (let type in this.#openMarkups) {
      if (this.#openMarkups[type]) {
        let tag = MARKUP_TAGS[type];
        let attrs;

        if (type === MARKUP.MARK || tag === MARKUP.COLOR) {
          let color = typeof this.#openMarkups[type] === 'boolean' ? 'default' : this.#openMarkups[type];

          attrs = { class: `color-${color}` };
        }

        this._openElement(tag, attrs);
      }
    }

    // let textNode = document.createTextNode(spaceEscaped);
    // let startIndex = this._currentIndex;
    // this._currentIndex += str.length;

    // if (startIndex <= this._cursor[0] && this._currentIndex >= this._cursor[0]) {
    //   this._selectionRange.setStart(textNode, this._cursor[0] - startIndex);
    // }

    // if (startIndex <= this._cursor[1] && this._currentIndex >= this._cursor[1]) {
    //   this._selectionRange.setEnd(textNode, this._cursor[1] - startIndex);
    // }

    // this._currentElement.appendChild(textNode);

    this._renderText += spaceEscaped;

    for (let item in this.#openMarkups) {
      if (this.#openMarkups[item]) {
        this._closeElement();
      }
    }
  }

  _emitControl(str) {
    this._openElement('span', { class: 'control' });
    this._emitText(str);
    this._closeElement();
  }

  _handleContent(content) {
    for (let item of content) {
      if (typeof item === 'string') {
        this._emitText(item);
      } else if (item.isOpen) {
        if (item.type === MARKUP.LINK) {
          this._openLink(item.value);
        } else {
          this._openControl(item.type, item.value);
        }
      } else {
        if (item.type === MARKUP.LINK) {
          this._closeLink(item.value);
        } else {
          this._closeControl(item.type);
        }
      }
    }
  }

  _openControl(type, value = true) {
    this.#openMarkups[type] = value;
    this._emitControl(MARKUP_CONTROLS[type]);
  }

  _closeControl(type) {
    this._emitControl(MARKUP_CONTROLS[type]);

    let value = this.#openMarkups[type];

    if (typeof value === 'string') {
      this._emitControl(`(${value})`);
    }

    this.#openMarkups[type] = false;
  }

  _openLink(url) {
    this._emitControl('[');
    this._openElement('a', { href: url });
  }

  _closeLink(url) {
    this._closeElement();
    this._emitControl('](');
    this._openElement('span', { class: 'link', contenteditable: false });
    this._openElement('img', { src: 'inline-link' });
    this._closeElement()
    this._emitText(url);
    this._closeElement()
    this._emitControl(')');
  }

  _createHeading(node) {
    let headingLevel = node.value;

    let element = this._openElement(`h${headingLevel}`);

    this._openElement('span', { class: `heading-${headingLevel}`, contenteditable: false });

    let headingText = '';

    for (let i = 0; i < headingLevel; i++) {
      headingText += '#';
    }

    this._emitText(headingText);

    this._closeElement();

    this._emitText(' ');

    this._handleContent(node.content);

    this._emitText('\n');
    this._closeElement();

    return this._renderText;
  }

  _createParagraph(node) {
    let element = this._openElement('p');

    let beforeLength = this._renderText.length;
    this._handleContent(node.content);

    if (this._renderText.length === beforeLength) {
    // if (this._currentElement.textContent.length === 0) {
      this._openElement('br');
      this._closeElement();
    }

    this._emitText('\n');
    this._closeElement();

    return this._renderText;
  }

  _createAside(node) {
    let element = this._openElement('aside');

    this._openElement('span', { class: 'aside-control' });
    this._emitText('> ');
    this._closeElement();

    this._handleContent(node.content);

    this._emitText('\n');
    this._closeElement();

    return this._renderText;
  }

  _createUnorderedListItem(node) {
    let element = this._openElement('div', { class: 'unordered-item' });

    this._openElement('span', { class: 'unordered-control' });
    this._emitText('* ');
    this._closeElement();

    this._handleContent(node.content);

    this._emitText('\n');
    this._closeElement();

    return this._renderText;
  }

  _createOrderedListItem(node) {
    let element = this._openElement('div', { class: 'ordered-item' });

    this._openElement('span', { class: 'ordered-control' });
    this._emitText(`${node.value}. `);
    this._closeElement();

    this._handleContent(node.content);

    this._emitText('\n');
    this._closeElement();

    return this._renderText;
  }

  _createPre(node) {
    let element = this._openElement('pre');

    this._emitText(`\`\`\`${node.language}`);

    this._handleContent(node.content);

    this._emitText('\n```\n');
    this._closeElement();

    return this._renderText;
  }
}

let domRenderer = new DomRenderer();

export default class EditorRenderer {
  text = '';

  _nodes = [];
  _nodeLengths = [];

  #cache = {};

  constructor(text) {
    this.render(new Delta(0, '', text))
  }

  render(delta) {
    this.text = delta.apply(this.text);

    let parsed = parse(this.text);

    let oldCache = this.#cache;
    let newCache = {};

    let newNodes = parsed.map(n => {
      let hash = JSON.stringify(n);

      let rendered;

      // if (oldCache[hash] && oldCache[hash].length > 0) {
      //   rendered = oldCache[hash].pop();
      // } else {
        rendered = domRenderer.renderNode(n);
      // }

      newCache[hash] = newCache[hash] || [];
      newCache[hash].push(rendered);

      return rendered
    });

    this.#cache = newCache;

    Ember.set(this, '_nodes', newNodes);
  }
}

import tokenize, { TokenType } from './tokenize';

// export { SECTION, MARKUP };

type WriteDownNode = {
  type: TokenType;
  indent: number;
  value: any;
  ops: Array<TokenType | OpCode>;
  values: Array<string>;
};

type MarkupTypeMap = {
  [t: number]: TokenType | TokenType[];
};

export const enum OpCode {
  OPEN = TokenType._LAST,
  CLOSE,
  VALUE,
  APPEND,
}

const SECTION_TOKENS = new Set([
  TokenType.PARAGRAPH,
  TokenType.HEADER,
  TokenType.UNORDERED,
  TokenType.ORDERED,
  TokenType.UNCHECKED,
  TokenType.CHECKED,
  TokenType.ASIDE,
  TokenType.SEPARATOR,
  TokenType.PRE,
  TokenType.PRE_LANG,
]);

const OPEN_MARKUP_TOKENS = {
  [TokenType.LINK]: TokenType.LINK_CLOSE,
  [TokenType.EMBED]: TokenType.LINK_CLOSE,
  [TokenType.BOLD]: TokenType.BOLD,
  [TokenType.ITALIC]: TokenType.ITALIC,
  [TokenType.UNDERLINE]: TokenType.UNDERLINE,
  [TokenType.STRIKE]: TokenType.STRIKE,
  [TokenType.CODE]: TokenType.CODE,
  [TokenType.MARK]: [TokenType.MARK, TokenType.MARK_CLOSE],
  [TokenType.COLOR]: [TokenType.COLOR, TokenType.COLOR_CLOSE],
};

const CLOSE_MARKUP_TOKENS: MarkupTypeMap = {
  [TokenType.LINK_CLOSE]: [TokenType.LINK, TokenType.EMBED],
  [TokenType.BOLD]: TokenType.BOLD,
  [TokenType.ITALIC]: TokenType.ITALIC,
  [TokenType.UNDERLINE]: TokenType.UNDERLINE,
  [TokenType.STRIKE]: TokenType.STRIKE,
  [TokenType.CODE]: TokenType.CODE,
  [TokenType.MARK]: TokenType.MARK,
  [TokenType.MARK_CLOSE]: TokenType.MARK,
  [TokenType.COLOR]: TokenType.COLOR,
  [TokenType.COLOR_CLOSE]: TokenType.COLOR,
};

const OPEN_MARKUP_TOKEN_COUNT = Object.keys(OPEN_MARKUP_TOKENS).length;
// const CLOSE_MARKUP_TOKEN_COUNT = Object.keys(CLOSE_MARKUP_TOKENS).length;

const SKIP = -1;

function processCodeTokens(tokens: Array<TokenType | number>) {
  let openPreIdx = -1;
  let openCodeIdx = -1;

  let filteredTokens = [];

  for (let i = 0; i < tokens.length; i += 3) {
    let tokenType = tokens[0];

    if (tokenType === TokenType.PRE_LANG) {
      if (openPreIdx !== -1) {
        tokens[openPreIdx] = SKIP;
      }

      openPreIdx = i;
    }

    if (tokenType === TokenType.PRE) {
      openPreIdx = openPreIdx === -1 ? i : -1;
    }

    if (tokenType === TokenType.CODE) {
      openCodeIdx = openCodeIdx === -1 ? i : -1;
    }

    if (SECTION_TOKENS.has(tokenType)) {
      if (openCodeIdx !== -1) {
        tokens[openCodeIdx] = SKIP;
        openCodeIdx = -1;
      }
    }
  }

  if (openCodeIdx !== -1) {
    tokens[openCodeIdx] = SKIP;
  }

  if (openPreIdx !== -1) {
    tokens[openPreIdx] = SKIP;
  }
}

function processMarkupTokens(tokens: Array<TokenType | number>) {
  let openMarkups: number[] = new Array(OPEN_MARKUP_TOKEN_COUNT).fill(-1);

  for (let i = 0; i < tokens.length; i += 3) {
    let tokenType = tokens[i];

    if (tokenType === SKIP) {
      continue;
    }

    if (SECTION_TOKENS.has(tokenType)) {
      // Clear the stack, markups can't cross section boundaries
      openMarkups.forEach((index, markupType) => {
        if (index !== -1) {
          tokens[index] = SKIP;
        }

        openMarkups[markupType] = -1;
      });
    }

    if (tokenType === TokenType.PRE || tokenType === TokenType.PRE_LANG) {
      while (true) {
        i += 3;
        tokenType = tokens[i];

        // Skip the last PRE tag
        tokens[i] = SKIP;

        if (tokenType === TokenType.PRE) {
          break;
        }
      }
    } else if (tokenType === TokenType.CODE) {
      while (true) {
        i += 3;
        tokenType = tokens[i];

        if (tokenType === TokenType.CODE) {
          break;
        }

        tokens[i] = SKIP;
      }
    } else if (tokenType in OPEN_MARKUP_TOKENS && openMarkups[tokenType] !== -1) {
      openMarkups[tokenType] === i;
    } else if (tokenType in CLOSE_MARKUP_TOKENS) {
      let type = CLOSE_MARKUP_TOKENS[tokenType];

      if (Array.isArray(type)) {
        type.forEach(type => {
          let openMarkupIdx = openMarkups[type];

          if (openMarkupIdx !== -1) {
            tokens[openMarkupIdx] = type;
            openMarkups[type] = -1
          }
        });
      } else {
        let openMarkupIdx = openMarkups[type];

        if (openMarkupIdx !== -1) {
          tokens[openMarkupIdx] = type;
          openMarkups[type] = -1
        }
      }
    }
  }
}

export default function parse(text: string) {
  text = '\n' + text;

  let tokens = tokenize(text);

  processCodeTokens(tokens);
  processMarkupTokens(tokens);

  let nodes = [];

  let currentNode: WriteDownNode;
  let openMarkups: boolean[] = new Array(OPEN_MARKUP_TOKEN_COUNT).fill(false);

  for (let i = 0; i < tokens.length; i += 3) {
    let currentTokenType = tokens[i];
    let currentTokenStart = tokens[i + 1];
    let currentTokenEnd = tokens[i + 2];

    if (currentTokenType === SKIP) {
      continue;
    }

    let nextTokenType = tokens[i + 3];
    let nextTokenStart = tokens[i + 4];

    let nextBegin = nextTokenType !== undefined ? nextTokenStart : text.length;
    let tokenText = text.slice(currentTokenStart, currentTokenEnd + 1);
    let betweenText = text.slice(currentTokenEnd + 1, nextBegin);

    if (SECTION_TOKENS.has(currentTokenType)) {

      let indent = tokenText.includes('\t') ? tokenText.match(/\t/g)!.length : 0;

      currentNode = {
        type: currentTokenType,
        value: null,
        indent,
        ops: [],
        values: [],
      };

      if (currentNode.type === TokenType.HEADER) {
        let headerLevel = tokenText.match(/#/g)!.length;

        if (headerLevel > 6) {
          // Don't allow headers greater than 6, convert to paragraph
          currentNode.type = TokenType.PARAGRAPH;
          betweenText = tokenText + betweenText;
        } else {
          currentNode.value = headerLevel;
        }
      }

      if (currentNode.type === TokenType.ORDERED) {
        currentNode.value = tokenText.match(/\d+/)![0];
      }

      if (currentNode.type === TokenType.PRE || currentNode.type === TokenType.PRE_LANG) {
        currentNode.type = TokenType.PRE;
        currentNode.value = tokenText.match(/```(.*)/)![1];
        betweenText = betweenText.substr(0, betweenText.length - 4);
      }

      nodes.push(currentNode);
    } else if (currentTokenType in OPEN_MARKUP_TOKENS) {
      if (openMarkups[currentTokenType] === false) {
        openMarkups[currentTokenType] = true;

        currentNode!.ops.push(OpCode.OPEN, currentTokenType);
      } else {
        openMarkups[currentTokenType] = false;

        currentNode!.ops.push(OpCode.CLOSE, currentTokenType);

        let value = tokenText.match(/\((.*)\)/);

        if (value !== null && value[1].length > 0) {
          currentNode!.ops.push(OpCode.VALUE);
          currentNode!.values.push(value[1]);
        }
      }
    }

    if (betweenText.length > 0) {
      debugger
      currentNode!.ops.push(OpCode.APPEND);
      currentNode!.values.push(betweenText);
    }

    // let currentItem = { text: '', open: [], close: [] };

    // while (!SECTION_CODES.has(tokens[i + 1]) {
    //   let metaItem = meta[i];

    //   if (metaItem) {
    //     if (SECTION_CODES.has(metaItem.type)) {
    //       break;
    //     }

    //     if (metaItem.isOpen) {
    //       if (currentItem.text.length > 0 || currentItem.close.length) {
    //         currentNode.content.push(currentItem);
    //         currentItem = { text: '', open: [], close: [] };
    //       }

    //       let { type, value } = metaItem;

    //       currentItem.open.push({ type, value });
    //     } else if (metaItem.isClose) {
    //       let { type, value } = metaItem;

    //       currentItem.close.push({ type, value });
    //     }

    //     i = metaItem.end + 1;

    //     continue;
    //   }

    //   if (currentItem.close.length) {
    //     currentNode.content.push(currentItem);
    //     currentItem = { text: '', open: [], close: [] };
    //   }

    //   currentItem.text += text[i];
    //   i++;
    // }
  }

  // console.log(tokens, nodes);

  return nodes;
}

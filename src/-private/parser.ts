import tokenize, { TokenType } from './tokenize';

// export { SECTION, MARKUP };

export type WriteDownNode = {
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

function processCodeTokens(tokens: Int32Array) {
  let openPreIdx = -1;
  let openCodeIdx = -1;

  let i = 0;

  while (tokens[i] !== TokenType.EOF) {
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

    i += 3;
  }

  if (openCodeIdx !== -1) {
    tokens[openCodeIdx] = SKIP;
  }

  if (openPreIdx !== -1) {
    tokens[openPreIdx] = SKIP;
  }
}

function processMarkupTokens(tokens: Int32Array) {
  let openMarkups: Map<number, number> = new Map();

  let i = 0;

  while (tokens[i] !== TokenType.EOF) {
    let tokenType = tokens[i];

    if (tokenType === SKIP) {
      continue;
    }

    if (SECTION_TOKENS.has(tokenType)) {
      // Clear the stack, markups can't cross section boundaries
      openMarkups.forEach(index => (tokens[index] = SKIP));
      openMarkups.clear();
    }

    if (tokenType === TokenType.PRE || tokenType === TokenType.PRE_LANG) {
      while (true) {
        i += 3;
        tokenType = tokens[i];

        if (tokenType === TokenType.PRE) {
          break;
        }

        tokens[i] = SKIP;
      }
    }

    if (tokenType === TokenType.CODE) {
      while (true) {
        i += 3;
        tokenType = tokens[i];

        if (tokenType === TokenType.CODE) {
          break;
        }

        tokens[i] = SKIP;
      }
    }

    if (tokenType === TokenType.LINK && openMarkups.has(tokenType)) {
      tokens[openMarkups.get(tokenType)!] = SKIP;
      openMarkups.delete(tokenType);
    }

    if (tokenType in OPEN_MARKUP_TOKENS && !openMarkups.has(tokenType)) {
      openMarkups.set(tokenType, i);
    } else if (tokenType in CLOSE_MARKUP_TOKENS) {
      let type = CLOSE_MARKUP_TOKENS[tokenType];

      if (Array.isArray(type)) {
        type.forEach(type => {
          if (openMarkups.has(type)) {
            tokens[i] = type;
            openMarkups.delete(type);
          }
        });
      } else {
        if (openMarkups.has(type)) {
          tokens[i] = type;
          openMarkups.delete(type);
        }
      }
    }

    i += 3;
  }

  // Clear the stack, markups can't cross section boundaries
  openMarkups.forEach(index => (tokens[index] = SKIP));
  openMarkups.clear();
}

export default function parse(text: string) {
  text = '\n' + text;

  let tokens = tokenize(text);

  console.log(tokens);

  processCodeTokens(tokens);

  console.log(tokens);

  processMarkupTokens(tokens);

  console.log(tokens);

  let nodes = [];

  let currentNode: WriteDownNode;
  let openMarkups: Set<number> = new Set();
  let openSections: Set<number> = new Set();

  let currentIndex = 0;
  let lastTokenEnd;

  while (true) {
    let currentTokenType = tokens[currentIndex];
    let currentTokenStart = tokens[currentIndex + 1];
    let currentTokenEnd = tokens[currentIndex + 2];

    currentIndex += 3;

    if (currentTokenType === SKIP) {
      continue;
    } else if (lastTokenEnd !== undefined && lastTokenEnd + 1 !== currentTokenStart) {
      let buffer = text.slice(lastTokenEnd + 1, currentTokenStart);

      currentNode!.ops.push(OpCode.APPEND);
      currentNode!.values.push(buffer);
    }

    if (currentTokenType === TokenType.EOF) {
      break;
    }

    lastTokenEnd = currentTokenEnd;

    let tokenText = text.slice(currentTokenStart, currentTokenEnd + 1);

    if (SECTION_TOKENS.has(currentTokenType)) {
      if (openSections.has(currentTokenType)) {
        openSections.delete(currentTokenType);
      } else {
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
            lastTokenEnd -= tokenText.length;
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
          openSections.add(TokenType.PRE);
        }

        nodes.push(currentNode);
      }
    } else if (currentTokenType in OPEN_MARKUP_TOKENS) {
      if (!openMarkups.has(currentTokenType)) {
        openMarkups.add(currentTokenType);

        currentNode!.ops.push(OpCode.OPEN, currentTokenType);
      } else {
        openMarkups.delete(currentTokenType);

        currentNode!.ops.push(OpCode.CLOSE, currentTokenType);

        let value = tokenText.match(/\((.*)\)/);

        if (value !== null && value[1].length > 0) {
          currentNode!.ops.push(OpCode.VALUE);
          currentNode!.values.push(value[1]);
        }
      }
    }
  }

  return nodes;
}

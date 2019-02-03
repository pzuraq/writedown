export const enum TokenType {
  // Section Types
  PARAGRAPH,
  HEADER,
  UNORDERED,
  ORDERED,
  UNCHECKED,
  CHECKED,
  ASIDE,
  SEPARATOR,
  PRE,
  PRE_LANG,

  // Markup Types
  LINK,
  EMBED,
  LINK_CLOSE,

  BOLD,
  ITALIC,
  UNDERLINE,
  STRIKE,
  CODE,

  MARK,
  MARK_CLOSE,

  COLOR,
  COLOR_CLOSE,

  TAG,
  TAG_CLOSE,

  ESCAPED,

  EOF,

  _LAST,
}

const RECURSE = (Symbol('recurse') as unknown) as string;
const ACCEPT = (Symbol('accept') as unknown) as string;

const ANY = (Symbol('any') as unknown) as string;

const NUMBER = (Symbol('number') as unknown) as string;
const NON_NUMBER = (Symbol('non_number') as unknown) as string;
const SPACE = (Symbol('space') as unknown) as string;
const NON_SPACE = (Symbol('non_space') as unknown) as string;
const WORD = (Symbol('word') as unknown) as string;
const NON_WORD = (Symbol('non-word') as unknown) as string;

type CharClass = {
  symbol: string;
  regex: RegExp;
};

type CharClassMap = {
  [c: string]: CharClass;
};

const UNESCAPED_CHAR_CLASSES: CharClassMap = {
  '.': { symbol: ANY as string, regex: /./ },
};

const ESCAPED_CHAR_CLASSES: CharClassMap = {
  d: { symbol: NUMBER, regex: /\d/ },
  D: { symbol: NON_NUMBER, regex: /\d/ },

  w: { symbol: WORD, regex: /\w/ },
  W: { symbol: NON_WORD, regex: /\W/ },

  s: { symbol: SPACE, regex: /\s/ },
  S: { symbol: NON_SPACE, regex: /\S/ },
};

type AcceptNode = {
  value: TokenType;
  offset: number;
};

type TrieNode = {
  [c: string]: TrieNode | AcceptNode | string | undefined;
};

type Token = {
  type: TokenType;
  start: number;
  end: number;
};

class Trie {
  root: TrieNode = {};

  add(pattern: string, value: TokenType) {
    let currentNode = this.root;

    let acceptanceOffset = 0;
    let lookaheadEntered;

    for (let i = 0; i < pattern.length; i++) {
      let currentChar: string | Symbol = pattern[i];

      if (currentChar in UNESCAPED_CHAR_CLASSES) {
        currentChar = UNESCAPED_CHAR_CLASSES[currentChar].symbol;
      }

      if (currentChar === '(') {
        currentChar = pattern[++i];

        if (currentChar !== '?') {
          throw new Error('Non-lookahead groups not yet supported in trie');
        }

        currentChar = pattern[++i];
        lookaheadEntered = true;

        if (currentChar !== '=') {
          throw new Error('Trie can only handle positive lookahead');
        }

        currentChar = pattern[++i];
      }

      if (currentChar === ')') {
        if (!lookaheadEntered) {
          throw new Error('Attempted to close group without an open');
        }

        lookaheadEntered = false;
        continue;
      }

      if (currentChar === '\\') {
        currentChar = pattern[++i];

        if (currentChar in ESCAPED_CHAR_CLASSES) {
          currentChar = ESCAPED_CHAR_CLASSES[currentChar].symbol;
        }
      }

      let nextChar = pattern[i + 1];
      let nextNode;

      if (nextChar === '*') {
        if (currentNode[currentChar] && currentNode[currentChar] !== RECURSE) {
          throw new Error('Attempted to recurse in a node for a character that already is set');
        }

        i++;
        nextNode = RECURSE;
      } else {
        if (lookaheadEntered) {
          acceptanceOffset++;
        }

        nextNode = currentNode[currentChar] || {};
      }

      currentNode[currentChar] = nextNode;

      if (nextNode !== RECURSE) {
        currentNode = nextNode as TrieNode;
      }
    }

    if (currentNode[ACCEPT] !== undefined) {
      throw new Error('Multiple acceptance states in single node');
    }

    currentNode[ACCEPT] = {
      value,
      offset: acceptanceOffset,
    };
  }
}

let trie = new Trie();

trie.add('\n\t*', TokenType.PARAGRAPH);
trie.add('\n\t*##* ', TokenType.HEADER);
trie.add('\n\t*\\* ', TokenType.UNORDERED);
trie.add('\n\t*\\d\\d*\\. ', TokenType.ORDERED);
trie.add('\n\t*- ', TokenType.UNCHECKED);
trie.add('\n\t*\\+ ', TokenType.CHECKED);
trie.add('\n\t*> ', TokenType.ASIDE);

trie.add('\n\t*---(?=\n)', TokenType.SEPARATOR);

trie.add('\n\t*```(?=\n)', TokenType.PRE);
trie.add('\n\t*```\\w\\w*(?=\n)', TokenType.PRE_LANG);

trie.add('\\[', TokenType.LINK);
trie.add('!\\[', TokenType.EMBED);

trie.add('\\]\\(\\S\\S*\\)', TokenType.LINK_CLOSE);

trie.add('\\*', TokenType.BOLD);
trie.add('/', TokenType.ITALIC);
trie.add('_', TokenType.UNDERLINE);
trie.add('~', TokenType.STRIKE);
trie.add('`', TokenType.CODE);

trie.add('::', TokenType.MARK);
trie.add('::\\(\\d\\d*\\)', TokenType.MARK_CLOSE);
trie.add(':', TokenType.COLOR);
trie.add(':\\(\\d\\d*\\)', TokenType.COLOR_CLOSE);

trie.add('#\\S\\S*', TokenType.TAG);
trie.add('\\S#', TokenType.TAG_CLOSE);

trie.add('\\\\.', TokenType.ESCAPED);

export default function tokenize(text: string) {
  // Add an extra newline to match patterns that should also match $
  text = text + '\n';

  // The tokens array consists of triplets of integers
  //
  // 1. token type
  // 2. token start
  // 3. token end
  //
  // We size the array in advance and grow it as needed, hoping that the overall
  // number of tokens will be relatively small compared to the text. The array
  // should always be a multiple of 3 in length + 1. The extra number is to hold
  // the terminator (-1) should we completely fill the rest of the array. The
  // terminator may not be the last item in the array, but it will always exist
  // and this makes it easier for the parser to operate on the tokens.
  let tokens = new Int32Array(Math.ceil(text.length / 10) * 3);
  let tokenIndex = 0;

  for (let mainOffset = 0; mainOffset < text.length - 1; mainOffset++) {
    let currentNode = trie.root;

    let acceptValue;
    let acceptOffset = mainOffset;

    let tokenOffset = mainOffset;
    let nextNode;

    while (tokenOffset < text.length) {
      let currentChar = text[tokenOffset];

      nextNode = currentNode[currentChar];

      if (!nextNode) {
        for (let key in ESCAPED_CHAR_CLASSES) {
          let { symbol, regex } = ESCAPED_CHAR_CLASSES[key];

          if (symbol in currentNode && currentChar.match(regex)) {
            nextNode = currentNode[symbol];
          }
        }
      }

      if (!nextNode) {
        for (let key in UNESCAPED_CHAR_CLASSES) {
          let { symbol, regex } = UNESCAPED_CHAR_CLASSES[key];

          if (symbol in currentNode && currentChar.match(regex)) {
            nextNode = currentNode[symbol];
          }
        }
      }

      if (nextNode === undefined) {
        break;
      }

      if (nextNode !== RECURSE) {
        currentNode = nextNode as TrieNode;
      }

      if (currentNode[ACCEPT] !== undefined) {
        let acceptNode = currentNode[ACCEPT] as AcceptNode;
        acceptValue = acceptNode.value;
        acceptOffset = tokenOffset - acceptNode.offset;
      }

      tokenOffset++;
    }

    if (acceptValue !== undefined) {
      if (acceptValue !== TokenType.ESCAPED) {
        tokens[tokenIndex] = acceptValue;
        tokens[tokenIndex + 1] = mainOffset;
        tokens[tokenIndex + 2] = acceptOffset;

        tokenIndex += 3;

        if (tokenIndex === tokens.length) {
          let newTokens = new Int32Array(tokens.length * 2);
          newTokens.set(tokens);
          tokens = newTokens;
        }
      }

      mainOffset = acceptOffset;
    }
  }

  tokens[tokenIndex] = TokenType.EOF;
  tokens[tokenIndex + 1] = text.length - 1;
  tokens[tokenIndex + 2] = text.length - 1;

  return tokens;
}

// console.log(trie.match('\n\t##  ', 0))
// console.log(trie.match('\n##', 0))

// console.log(trie.match('\n\t* ', 0))
// console.log(trie.match('\n*', 0))

// console.log(trie.match('\n123. ', 0))
// console.log(trie.match('\n012. ', 0))
// console.log(trie.match('\n12 ', 0))

// console.log(trie.match('\n- ', 0));
// console.log(trie.match('\n-', 0));

// console.log(trie.match('\n\t+ ', 0));
// console.log(trie.match('\n\t+', 0));

// console.log(trie.match('\n> ', 0));
// console.log(trie.match('\n>', 0));

// console.log(trie.match('\n```aoeu\n', 0))
// console.log(trie.match('\n```\n', 0))
// console.log(trie.match('``', 0))

import { languages } from 'monaco-editor';

export const registerCasebookLanguage = () => {
  // Register a new language
  languages.register({
    id: 'casebook',
    extensions: ['.case'],
    aliases: ['Casebook', 'casebook'],
  });

  // Register a tokens provider for the language
  languages.setMonarchTokensProvider('casebook', {
    defaultToken: 'invalid',

    // Keywords from the grammar
    keywords: [
      'SCENE', 'DO', 'LET', 'WHILE', 'RETURN', 'THEN',
      '$if', '$elif', 'ELSE', '$for', 'in',
      'true', 'false', 'null'
    ],

    // Section types
    sections: [
      'OPTIONS', 'SETUP', 'COVER', 'FRONT', 'HINTS',
      'DOCUMENTS', 'LEADS', 'DAY_SECTION', 'GENERIC', 'END'
    ],

    // Operators
    operators: [
      '&&', '||', '!', '==', '!=', '>', '<', '>=', '<=',
      '+', '-', '*', '/', '='
    ],

    // Special symbols
    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    // Escapes
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // The main tokenizer
    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],

        // Section headers
        [/^#\s*/, 'delimiter.header', '@section_header'],

        // Child headers
        [/^##\s*/, 'delimiter.header', '@child_header'],

        // Character lines
        [/^[A-Z][A-Z0-9_]+(?:\s*[A-Z][A-Z0-9_]+)*\s*:/, 'character'],

        // Keywords
        [/\b(?:SCENE|DO|LET|WHILE|RETURN|THEN)\b/, 'keyword'],
        [/\$(?:if|elif|for)\b/, 'keyword.control'],
        [/\b(?:ELSE)\b/, 'keyword.control'],
        [/\b(?:true|false|null)\b/, 'keyword.constant'],

        // Section types
        [/\b(?:OPTIONS|SETUP|COVER|FRONT|HINTS|DOCUMENTS|LEADS|DAY_SECTION|GENERIC|END)\b/, 'type.identifier'],

        // Function calls
        [/\$[a-zA-Z][a-zA-Z0-9_]*(?:configure|check|get|set|is|has|find|create|update|delete|validate|process)[A-Za-z0-9_]*/, 'support.function'],

        // Identifiers
        [/[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*/, 'identifier'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/"""/, 'string', '@string_triple_double'],
        [/'''/, 'string', '@string_triple_single'],

        // Raw text blocks
        [/<<</, 'delimiter', '@raw_text'],

        // Delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!<<|>>)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],

        // Numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/\d+/, 'number'],

        // Whitespace
        [/\s+/, 'white']
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ],

      section_header: [
        [/[a-zA-Z0-9][a-zA-Z0-9_\-\.\/]*/, 'entity.name.section'],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/\$\(/, 'delimiter', '@options'],
        [/\n/, '', '@pop']
      ],

      child_header: [
        [/[a-zA-Z0-9][a-zA-Z0-9_\-\.\/]*/, 'entity.name.section'],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/\$\(/, 'delimiter', '@options'],
        [/\n/, '', '@pop']
      ],

      options: [
        [/\)/, 'delimiter', '@pop'],
        [/[a-zA-Z_][a-zA-Z0-9_]*\s*=/, 'attribute.name'],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],
        [/[^)"']+/, ''],
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop']
      ],

      string_triple_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"""/, 'string', '@pop']
      ],

      string_triple_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'''/, 'string', '@pop']
      ],

      raw_text: [
        [/[^>]+/, 'string.raw'],
        [/>>>/, 'delimiter', '@pop']
      ]
    }
  });

  // Define the language configuration
  languages.setLanguageConfiguration('casebook', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
      ['<<<', '>>>']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '"""', close: '"""' },
      { open: "'''", close: "'''" },
      { open: '<<<', close: '>>>' }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '<<<', close: '>>>' }
    ]
  });
};

import {types as tt} from "./types";
import {Position} from "../util/location";

export default class State {
  init(options, inputFile) {
    // TODO: decide if non-strict should be supported
    this.options = options;
    this.warnings = [];

    //////// File ////////

    this.inputFile = inputFile;

    this.sourceFile = this.options.sourceFile;

    // Used to signal to callers of `readWord1` whether the word
    // contained any escape sequences. This is needed because words with
    // escape sequences must not be interpreted as keywords.
    this.containsEsc = false;

    // Figure out if it's a module code.
    this.strict = this.inModule = this.options.sourceType === "module";

    //////// Character ////////

    // The current position of the tokenizer in the input.
    this.pos = this.lineStart = 0;
    this.curLine = 1;

    // The current indent level
    this.indentation = 0;
    this.nextIndentation = 0;
    // The detected whitespace used for indentation
    // This must be consistent through the file, or else it is a syntax error
    this.indentString = null;
    this.indentCharCode = -1;
    this.indentRepeat = -1;

    // When tokenizing, we lookahead past a newline, athen insert the indent token before the newline
    this.indentStart = -1;
    this.indentEnd = -1;

    //////// Context ////////

    // Used to signal that we have already checked for indentation changes after
    // any upcoming newlines. Set to false after an indent or detent (or no
    // indentation change token) has been pushed, and reset to true after a newline
    // has been pushed.
    // Used to signal if we will be skipping upcoming indentation
    // This is set in `readIndentationMaybe` and unset in `skipIndentation`
    this.eol = true;

    // Flags to track whether we are in a function, a method, a generator, an async function.
    // inFunction is used for validity of `return`
    // inMethod is for `super`
    // TODO: check spec to see if super is allowed in any functions, add tests
    // inGenerator is for `yield`
    // inAsync is for `await`
    this.inFunction = this.inMethod = this.inGenerator = this.inAsync = false;

    // Flag for if we're in the deader of a "for" loop, to decidee if `while`
    // is for starting a loop or just to start the `test`
    this.inForHeader = false;

    // Labels in scope.
    this.labels = [];

    // List of currently declared decorators, awaiting attachment
    this.decorators = [];

    // The context stack is used to superficially track syntactic
    // context to predict whether a regular expression is allowed in a
    // given position.
    this.context = this.initialContext();
    this.exprAllowed = true;

    // Flag to see if we are inside a grouping operator `()` (but not function arguments)
    // or inside a computed subscript `[]` (but not an array expression)
    this.significantWhitespaceContext = [true];

    // used to communicate to children in the recursive descent if statements
    // are allowed in the given context
    // TODO: replace with a stack
    this.statementAllowed = true;

    //////// Token ////////

    // All tokens parsed, will be attached to the file node at the end of parsing
    this.tokens = [];
    // All tokens and non-tokens parsed
    this.sourceElementTokens = [];

    let curPosition = this.curPosition();
    // Properties of the current token:
    this.cur = {
      // Its type
      type: tt.eof,
      // For tokens that include more information than their type, the value
      value: null,
      // Its index in the token array
      index: this.tokens.length,
      // Its start and end offset
      start: this.pos,
      end: this.pos,
      // And, if locations are used, the {line, column} object
      // corresponding to those offsets
      startLoc: curPosition,
      endLoc: curPosition,

      sourceFile: this.sourceFile,
    };

    // Position information for the previous token
    this.prev = {...this.cur};

    // Position information for the next token (single token fixed lookahead)
    this.next = {...this.cur, type: tt.unknown};

    // Used to signify information about the start of a potential anonymous
    // function expression
    // Equivalent to acorn & babylon's potentialArrowAt
    this.potentialLambdaOn = {...this.cur};
  }

  curPosition() {
    return new Position(this.curLine, this.pos - this.lineStart);
  }

  clone() {
    let clone = new State();
    for (let k in this) {
      switch(k) {
        case 'tokens': case 'sourceElementTokens': break;
        case 'cur': case 'prev': clone[k] = {...this[k]}; break;
        case 'context': clone.context = [].concat(this.context); break;
        default: clone[k] = this[k];
      }
    }
    return clone;
  }

  resetNext() {
    let nullPosition = new Position(1, 0);
    this.next = {
      // Its type
      type: tt.unknown,
      // For tokens that include more information than their type, the value
      value: null,
      // Its index in the token array
      index: -1,
      // Its start and end offset
      start: -1,
      end: -1,
      // And, if locations are used, the {line, column} object
      // corresponding to those offsets
      startLoc: nullPosition,
      endLoc: nullPosition,

      sourceFile: this.sourceFile,
    }
  };
}

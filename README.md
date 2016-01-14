<img alt="TacoScript Icon" src="https://rawgit.com/forivall/tacoscript/master/doc/icon.svg" width="42px" align="top"> [TacoScript][TacoScript] [![Build Status](https://travis-ci.org/forivall/tacoscript.svg?branch=master)](https://travis-ci.org/forivall/tacoscript)
==========

An es2015+-isomorphic altjs language, with syntax inspired by CoffeeScript,
Python, Ruby, and [frappe], and architecture inspired by [Babel].

<h2><a href="./doc/SPEC.md">Syntax Specification</a></h2>

## What does it mean that this language is "es2015+-isomorphic"?

TacoScript shares its Abstract Syntax Tree (AST) with JavaScript, via the
[estree] specification. This means that, for any valid JavaScript code, there is
an exact, lossless version of that code in TacoScript, and vice versa: For all
valid TacoScript code, there is an exact translated representation in
JavaScript. Currently, whitespace will not always be preserved; eventually,
whitespace will also be preserved.

> Unlike CoffeeScript, TacoScript _actually_ is just JavaScript.

So, if it is just JavaScript, why does this exist? For the same reason that
there are both British English and American English: Some people just prefer
different conventions.

And also to experiment with new syntax that won't or can't be an [ECMAScript]
proposal.

## Packages

### [tacoscript](./packages/tacoscript)
_(Not Implemented)_

Command line tools.

### [horchata](./packages/horchata)

Parses TacoScript into an AST/[CST].

    import * as horchata from "horchata"
    ast = horchata.parse(code, options)

### [tacoscript-generator](./packages/tacoscript-generator)

Generates TacoScript code from an estree AST/CST.  
Will also generate JavaScript code while preserving whitespace.

    import generate from "tacoscript-generator"
    code = generate(ast, options, originalSourceCode)

### [cstify](./packages/cstify)

Adds [CST] `sourceElements` to an existing JavaScript / estree CST.

### [comal](./packages/comal)
_(Not Implemented)_

AST translator (transpiler / detranspiler) core.

> comal (noun) _/koˈmal/_ - A flat, pan-like clay or metal griddle used to cook
> tortillas or other foods.

### tacoscript-eslint
_(Not Implemented)_

Transforms a TacoScript AST so that it can be checked by [ESLint].

### tacoscript-implicit-return-function
_(Not Implemented)_

AST transformations for implicitly returning functions ("sharp arrows").

### tacoscript-auto-const-extern
_(Not Implemented)_

Parser & Generator plugins for extern declarations. Required by any auto-const
plugins, or if anyone creates an auto-let or CoffeeScript-style auto-var
alternative plugin.

### tacoscript-auto-const-statement
_(Not Implemented)_

AST transformations for automatic const variables when assignment is a
statement. [_(Spec)_](./doc/auto-const.md).

### tacoscript-auto-const-expression-simple
_(Not Implemented)_

AST transformations for automatic const variables in restricted expression
forms. [_(Spec)_](./doc/auto-const.md).

### tacoscript-auto-const-full
_(Not Implemented)_

AST transformations for automatic const variables anywhere forms.
[_(Spec)_](./doc/auto-const.md). May create ugly JavaScript code.

### tacoscript-iife
_(Not Implemented)_

Parser & Generator plugins and AST transformations for immediately invoked
function expressions.

### tacoscript-strudel-this-member
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `this.` → [`@`][strudel]
shorthand.

### tacoscript-logical-assign
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `and=` and `or=`.

Could also include an acorn plugin for parsing `||=` and `&&=` in javascript.

### tacoscript-negative-conditional
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `unless` and `until`.

### tacoscript-useful-modulo
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `%%`.

### tacoscript-fluid-comparison
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `a < b < c`, etc.

### tacoscript-negative-binary-keywords
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `not instanceof`, `not
in` (, `not of`).

### tacoscript-asbool
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `!!` (`not not`) to
`asbool`.

### tacoscript-binary-of
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `of` binary operator.

### tacoscript-soak
_(Not Implemented)_

Parser & Generator plugins and AST transformations for soak member expressions:
`?.` and `?[`.

### tacoscript-null-coalescing-op
_(Not Implemented)_

Parser & Generator plugins and AST transformations for the null coalescing
operator: `a ? b`.

### tacoscript-null-coalescing-assign
_(Not Implemented)_

Combination of tacoscript-logical-assign and tacoscript-null-coalescing-op.

### tacoscript-typeof-null-is-null
_(Not Implemented)_

Parser & Generator plugins and AST transformations so that in TacoScript,
`typeof null === "null"`.

### tacoscript-safe-switch
_(Not Implemented)_

Parser & Generator plugins and AST transformations for the non-fallthrough
switch variant.

### tacoscript-double-strudel-class-member
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `@@` shorthand operator.

### tacoscript-generic-template-string
_(Not Implemented)_

### tacoscript-multiline-string
_(Not Implemented)_

### tacoscript-multiline-regex
_(Not Implemented)_

### tacoscript-boolean-switch-statement
_(Not Implemented)_

### tacoscript-boolean-switch-expression
_(Not Implemented)_

### tacoscript-auto-label
_(Not Implemented)_

Parser & Generator plugins and AST transformations for automatic labels for long
breaks: `break for`, etc.

### tacoscript-conditional-catch
_(Not Implemented)_

Parser & Generator plugins and AST transformations for [conditional catch
clauses].

### tacoscript-rescue
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `rescue` blocks for
functions, for simplified error handling.

### tacoscript-conditional-rescue
_(Not Implemented)_

Combines tacoscript-conditional-catch and tacoscript-rescue.

### tacoscript-incremental-for-loop
_(Not Implemented)_

Parser & Generator plugins and AST transformations for `upto`, `downto` and `by`
in for loop headers

### tacoscript-literate
_(Not Implemented)_

Parser & Generator plugins for literate mode.

### tacoscript-comprehensions
_(Not Implemented)_

### tacoscript-operator-overloading
_(Not Implemented)_

### tacoscript-block-break
_(Not Implemented)_

### tacoscript-variable-declaration-expressions
_(Not Implemented)_

### tacoscript-git-magic
_(Not Implemented)_

Git hooks to automatically create an equivalent history in git as if a
JavaScript project was written in TacoScript, and to therefore seamlessly
contribute to JavaScript projects by coding in TacoScript, and vice-versa.


[TacoScript]: http://tacoscript.github.io/
[frappe]: https://github.com/lydell/frappe
[Babel]: https://github.com/babel/babel
[estree]: https://github.com/estree/estree
[ECMAScript]: https://github.com/tc39/ecma262
[CST]: https://github.com/estree/estree/pull/107
[strudel]: http://www.catb.org/~esr/jargon/html/S/strudel.html
[ESLint]: http://eslint.org
[conditional catch clauses]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch#Conditional_catch_clauses

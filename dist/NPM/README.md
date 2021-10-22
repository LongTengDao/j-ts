
`@ltd/j-ts`
===========

```shell
npm install @ltd/j-ts
```

`@ltd/j-ts` vs `typescript`
---------------------------

### `input.ts`

```TypeScript
	type T = any;
	
	function * f (v :T) :T {
		return <T> v as T;
	}
	
```

### `require('@ltd/j-ts')(input :string, jsx :( (name :string, context :object) => string ) | boolean = false, fileName? :string)`

```JavaScript
	             
	
	function * f (v   )    {
		return     v     ;
	}
	
```

(The error thrown for `input` will have a `index :number` property.)  
（对 `input` 抛出的错误，会带上 `index :number` 属性。）  

### `require('typescript').transpileModule(input :string, options :object).outputText`

```JavaScript
function* f(v) {
    return v;
}
```

`typescript` ko `@ltd/j-ts`
---------------------------

|                                                                       | `typescript` | `@ltd/j-ts`  |              <kbd>Alt</kbd>               |
|-----------------------------------------------------------------------|:------------:|:------------:|-------------------------------------------|
| `public` / `protected` / `private` / `readonly` constructor parameter |      ✓      |      ✗      | ECMAScript class field                    |
| `enum $ { }` / `namespace $ { }` / `module $ { }`                     |      ✓      |      ✗      | `import * as $ from '';`                  |
| `import $ = require('');`                                             |      ✓      |      ✗      | `var $ :typeof import('') = require('');` |
| `export = $;`                                                         |      ✓      |      ✗      | `module.exports = $;`                     |
| `@$`                                                                  |      ✓      |      ✗      | wait ECMAScript decorator proposal        |

`@ltd/j-ts` ko `typescript`
---------------------------

|                                 | `@ltd/j-ts`  | `typescript` |          <kbd>Alt</kbd>              |
|---------------------------------|:------------:|:------------:|--------------------------------------|
| `let v :T = /*#__PURE__*/ f();` |      ✓      |      ✗      | `let v :T =`<br>`/*#__PURE__*/ f();` |

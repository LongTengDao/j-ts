
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

### `require('@ltd/j-ts')(input :string, jsx :boolean = false)`

```JavaScript
	             
	
	function * f (v   )    {
		return     v     ;
	}
	
```

(The error thrown will have a `pos :number` property if possible.)  
（抛出错误时，会尽量带上 `pos :number` 属性。）  

### `require('typescript').transpileModule(input :string, options :{}).outputText`

```JavaScript
function* f(v) {
    return v;
}
```

`typescript` ko `@ltd/j-ts`
---------------------------

|                                                             | `typescript` | `@ltd/j-ts`  |                 <kbd>Alt</kbd>                  |
|-------------------------------------------------------------|:------------:|:------------:|-------------------------------------------------|
| `public` / `protected` / `private` / `readonly` parameter   |      ✓      |      ✗      | field                                           |
| `return` / `throw` / `yield` + type + eol + value           |      ✓      |      ✗      | - eol                                           |
| `enum $ { }`                                                |      ✓      |      ✗      | `import * as $ from '';`                        |
| `import $ = require('');`                                   |      ✓      |      ✗      | `var $ :typeof import('') = require('');`       |
| `export = $;`                                               |      ✓      |      ✗      | `module.exports = $;`                           |
| jsx => js                                                   |      ✓      |      ✗      | Babel...                                        |

`@ltd/j-ts` ko `typescript`
---------------------------

|                                 | `@ltd/j-ts`  | `typescript` |          <kbd>Alt</kbd>              |
|---------------------------------|:------------:|:------------:|--------------------------------------|
| `let v :T = /*#__PURE__*/ f();` |      ✓      |      ✗      | `let v :T =`<br>`/*#__PURE__*/ f();` |

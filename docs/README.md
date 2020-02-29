
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
| `return` / `throw` / `yield` + type + eol + value           |      ✓      |      ✗      | - eol                                           |
| `enum c { }`                                                |      ✓      |      ✗      | `import * as c from '';`                        |
| `import f = require('');`                                   |      ✓      |      ✗      | `var f = require('');`                          |
| `export = f;`                                               |      ✓      |      ✗      | `module.exports = f;`                           |

`@ltd/j-ts` ko `typescript`
---------------------------

|                                 | `@ltd/j-ts`  | `typescript` |          <kbd>Alt</kbd>              |
|---------------------------------|:------------:|:------------:|--------------------------------------|
| `let v :T = /*#__PURE__*/ f();` |      ✓      |      ✗      | `let v :T =`<br>`/*#__PURE__*/ f();` |


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
	
	function f (v :T) :T {
		return <T> v as T;
	}
	
	class C extends S {
		a?;
		b;
		c? = 0;
		d = 0;
		static a?;
		static b;
		static c? = 0;
		static d = 0;
	}
```

### `require('@ltd/j-ts')(input :string, jsx? :boolean)`

```JavaScript
	             
	
	function f (v   )    {
		return     v     ;
	}
	
	class C extends S {
		   
		b;
		c  = 0;
		d = 0;
		          
		static b;
		static c  = 0;
		static d = 0;
	}
```

### `require('typescript').transpileModule(input :string, transpileOptions :object).outputText`

```JavaScript
function* f(v) {
    return v;
}
class C extends S {
    constructor() {
        super(...arguments);
        this.c = 0;
        this.d = 0;
    }
}
C.c = 0;
C.d = 0;
//# sourceMappingURL=module.js.map
```

`typescript` ko `@ltd/j-ts`
---------------------------

|                                                             | `typescript` | `@ltd/j-ts`  |               Alt                               |
|-------------------------------------------------------------|:------------:|:------------:|-------------------------------------------------|
| `return` / `throw` / `yield` + type + eol + value           |      ✓      |      ✗      | - eol                                           |
| `enum c { }`                                                |      ✓      |      ✗      | `import * as c from '';`                        |
| `import f = require('');`<br>`export = f;`                  |      ✓      |      ✗      | `var f = require('');`<br>`module.exports = f;` |
| `import { T } from '';`<br>`type U = T;`<br>`export { U };` |      ✓      |      ✗      | `export type U = import('').T;`                 |

`@ltd/j-ts` ko `typescript`
---------------------------

|                     | `@ltd/j-ts`  | `typescript` |              Alt           |
|---------------------|:------------:|:------------:|----------------------------|
| `class { #stage3 }` |      ✓      |      ✗      | `class { private stage3 }` |

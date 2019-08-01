
`@ltd/j-ts`
===========

```shell
npm install @ltd/j-ts
```

`@ltd/j-ts` vs `typescript`
---------------------------

### `input.ts`

```TypeScript
	function * f (v :any) :any {
		yield <any>
			dont_do_this;
		return <any>
			dont_do_this;
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

### `require('@ltd/j-ts')(input :string, es? :3 | 5)`

```JavaScript
	function * f (v     )      {
		yield      
			dont_do_this;
		return      
			dont_do_this;
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

### `require('typescript').transpileModule(input :string, options?).outputText`

```JavaScript
function* f(v) {
    yield dont_do_this;
    return dont_do_this;
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

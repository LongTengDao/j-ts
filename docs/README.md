
`@ltd/j-ts`
===========

```shell
npm install @ltd/j-ts
```

`@ltd/j-ts` vs `typescript`
---------------------------

`input`:

```TypeScript
	function noop (input :any) :any {
		
		return <any>input as any;
		
	}
```

`require('@ltd/j-ts')(input)`:

```JavaScript
	function noop (input     )      {
		
		return      input       ;
		
	}
```

`require('typescript').transpileModule(input).outputText`:

```JavaScript
function noop(input) {
    return input;
}

```

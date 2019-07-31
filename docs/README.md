
`@ltd/j-ts`
===========

```shell
npm install @ltd/j-ts
```

`@ltd/j-ts` vs `typescript`
---------------------------

### `input.ts`

```TypeScript
	function noop (input :any) :any {
		
		return <any>input as any;
		
	}
```

### `require('@ltd/j-ts')(input :string, es? :3 | 5).outputText`

```JavaScript
	function noop (input     )      {
		
		return      input       ;
		
	}
```

### `require('typescript').transpileModule(input :string, options?).outputText`

```JavaScript
function noop(input) {
    return input;
}

//# sourceMappingURL=...
```

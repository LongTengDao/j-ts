
`@ltd/j-ts`
===========

```shell
npm install @ltd/j-ts
```

`@ltd/j-ts` vs `typescript`
---------------------------

`input`:

```TypeScript
	type value = string;//
	
	function noop (input :value) :value {
		return input;
	}
```

`require('@ltd/j-ts')(input)`:

```JavaScript
	                    //
	
	function noop (input       )        {
		return input;
	}
```

`require('typescript').transpileModule(input)`:

```JavaScript
function noop(input) {
    return input;
}

```

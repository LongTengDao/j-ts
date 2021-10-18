import * as JSX from './toJSX';
import * as JS from './toJS';

export let ing :boolean = false;
export let handle = JSX.Generator;

export const onJSX = () :void => {
	handle = JSX.Generator;
	ing = true;
};

export const onJS$ = (compilerOptions :JS.CompilerOptions) :void => {
	JS.on$(compilerOptions);
	handle = JS.Generator;
	ing = true;
};
export const onJS = (jsx :JS.GenerateStart) :void => {
	JS.on(jsx);
	handle = JS.Generator;
	ing = true;
};

export const off = () :void => {
	JS.off();
	ing = false;
};

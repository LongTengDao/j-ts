( ) : 1 => {
	return < 1 >
		1;
};

( ) : never => {
	throw < 1 >
		1;
};

function * YIELD ( ) {
	yield < 1 >
		1;
}

enum ENUM {
	zero ,
	diy = 9 ,
	two = 2 ,
	three,
}

import * as types from '.d.ts';
import { value , type } from '.ts';
export { value , type } from '.ts';

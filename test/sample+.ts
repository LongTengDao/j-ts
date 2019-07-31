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

import { value , type } from 'MODULE';

export { value , type } from 'MODULE';

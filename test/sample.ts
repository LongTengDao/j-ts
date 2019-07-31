[
	function ( this ) { },
	function ( this , ) { },
	function ( this , arg ) { },
];

class CLASS < T extends any, U = any > extends Map < any , any > implements INTERFACE , INTERFACE {
	
	method ( ) : void
	[ 'method' ] ( ) : void { }
	
	static method ( ) : void
	static [ 'method' ] ( ) : void { }
	
	'property1' : 1;
	property2 : 2 = 2;
	[ 'property3' ] = 3;
	
	static 'property1' : 1;
	static property2 : 2 = 2;
	static [ 'property3' ] = 3;
	
	get accessor ( ) : 1 { return 1; }
	set 'accessor' ( value : 1 ) { }
	
}

function FUNCTION < T extends any, U = any > ( arg1 , arg2 : any , arg3 ? ) : void;
function FUNCTION < T extends any, U = any > ( arg1 , arg2 : any , arg3 = null ) : void { }

( arg1 : 1 = 1 , arg2 ? : 2 ) => { };

FUNCTION < 1 , 2 > ( < 1 > 1 , 2 as 2 ) ;

new globalThis ! . Map < 1 , 1 > ( [ ] , );

var VAR1 ,
	VAR2 : any ,
	VAR3 = 1 ,
	VAR4 : any = 1 ;

type TYPE = string ;

interface INTERFACE { }

namespace NAMESPACE { }

module MODULE { }

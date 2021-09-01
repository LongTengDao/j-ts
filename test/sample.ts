[
	function ( this ) { },
	function ( this , ) { },
	function ( this , arg ) { },
];

abstract class SUPER {
	abstract get accessor ( ) : string ;
	public abstract method ( ) ;
	//public abstract readonly property ;
}

class CLASS < T extends any, U = any > extends Map < any , any > implements INTERFACE , INTERFACE {
	
	constructor ( a , b , c , d ? ) ;
	constructor ( a , b , c = 3 , d ? ) { super(); }
	
	[ name : string ] : any ;
	[ index : number ] : any ;
	
	method ? ( ) : void
	[ 'method' ] ? ( this : this ) : void { }
	
	static method ( ) : void
	static [ 'method' ] ( ) : void { }
	
	'property1' : 1 ;
	property2 : 2 = 2 ;
	[ < 'property3' > 'property3' as 'property3' ] = 3 ;
	
	readonly propertyA ;
	propertyB ? ;
	propertyC ? = 0 ;
	
	static 'property1' : 1 ;
	static property2 : 2 = 2 ;
	static [ < 'property3' > 'property3' as 'property3' ] = 3 ;
	
	get accessor ( ) : 1 { return 1 ; }
	set 'accessor' ( value : 1 ) { }
	
	public PUBLIC;
	private PRIVATE;
	protected PROTECTED;
	
	readonly #stage3 : '#' = '#' ;
	readonly declare '[[set]]' : 3.8 ;
	
	non ! : 0 ;
	
}

function FUNCTION < T extends any, U = any > ( arg1 , arg2 : null , arg3 ? ) : void;
function FUNCTION < T extends any, U = any > ( arg1 , arg2 : null , arg3 = null , arg4 : null = null ) : void { }

( arg1 : 1 = 1 , arg2 ? : 2 ) : { [ k in 'k' ] : 1 } => ({k:1});

FUNCTION < 1 , 2 > ( < 1 > 1 , null as null ) ;

new globalThis ! . Map < 1 , 1 > ( [ ] , );

var VAR1 ,
	VAR2 : any ,
	VAR3 = 1 ,
	VAR4 : (1) = 1 ;

var IMPORT :import('');
declare module '' { export = a; type a = any; }

type TYPE = any ;

interface INTERFACE { }

namespace NAMESPACE { }

module MODULE { }

a => a ;

function * g () {
	yield ;
	yield 1 as 1 ;
	yield *
		g ( ) ;
	return < 1 > 1 ;
}

export declare const a ;
export type { CLASS };
import type A from '';
import type { B } from '';
import type * as C from '';

Array ?. ( < 1 > 1 ) ;
Array ?. < 1 > ( < 1 > 1 ) ;

try { } catch ( e : unknown ) { }

class X extends ( Array ) < 1 > { }

( <T> (t :any) => {} ) <1> ``;

class Name < T > {}

let b ! : 1 ;

( a : `${1}` ) : `${1}` => a ;

class Super { m () {} }
class Sub extends Super { override m () {} }

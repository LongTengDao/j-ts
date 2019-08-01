'use strict';

const version = '3.0.6';

const throwRangeError = (
	/*! j-globals: throw.RangeError (internal) */
	function throwRangeError (message) {
		throw RangeError(message);
	}
	/*¡ j-globals: throw.RangeError (internal) */
);

const undefined$1 = void 0;

const {
	createSourceFile,
	ScriptTarget: { ES3, ES5, Latest },
	ScriptKind: { TS },
	SyntaxKind: {
		TypeAliasDeclaration,
		TypeAssertionExpression,
		AsExpression,
		HeritageClause,
		Identifier,
		FunctionExpression,
		FunctionDeclaration,
		ClassDeclaration,
		ClassExpression,
		ArrowFunction,
		MethodDeclaration,
		GetAccessor,
		SetAccessor,
		TypeParameter,
		VariableDeclaration,
		PropertyDeclaration,
		Parameter,
		QuestionToken,
		CallExpression,
		NewExpression,
		IntersectionType,
		TypeReference,
		LiteralType,
		UnionType,
		TupleType,
		StringKeyword,
		NumberKeyword,
		SymbolKeyword,
		BooleanKeyword,
		FunctionType,
		TypeLiteral,
		NullKeyword,
		NeverKeyword,
		AnyKeyword,
		ObjectKeyword,
		TypeOperator,
		BigIntKeyword,
		UndefinedKeyword,
		VoidKeyword,
		ArrayType,
		FirstTypeNode,
		ConditionalType,
		InterfaceDeclaration,
		EnumDeclaration,
		DeclareKeyword,
		Block,
		EndOfFileToken,
		NonNullExpression,
		UnknownKeyword,
		IndexedAccessType,
		TypeQuery,
		ModuleDeclaration,
		MappedType,
		LastTypeNode,
	},
	forEachChild,
} = require('typescript');

const S = /\S/g;
const remove = (exp        )         => exp.replace(S, ' ');

const GT = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*)>/;
const removeFirstGT = (exp        )         => exp.replace(GT, ' ');

const THIS = /^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*this(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*$/;
const COMMA = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*),/;

function afterColon (node      )          {
	switch ( node.kind ) {
		case IndexedAccessType:
		case IntersectionType:
		case ConditionalType:
		case FunctionType:
		case LiteralType:
		case MappedType:
		case UnionType:
		case TupleType:
		case ArrayType:
		
		case FirstTypeNode:
		case LastTypeNode:
		
		case TypeReference:
		case TypeOperator:
		case TypeLiteral:
		case TypeQuery:
		
		case VoidKeyword:
		case UndefinedKeyword:
		case BooleanKeyword:
		case NumberKeyword:
		case StringKeyword:
		case SymbolKeyword:
		case BigIntKeyword:
		case ObjectKeyword:
		case AnyKeyword:
		case NeverKeyword:
		case UnknownKeyword:
			return true;
		case NullKeyword:
			return ts.endsWith(':', node.pos);
	}
	return false;
}

let ts         = '';

function transpileModule (input        , esv        )                         {
	try {
		return {
			outputText:
				from(
					createSourceFile(
						'',
						ts = input,
						esv
							? esv===3 ? ES3
							: esv===5 ? ES5
								: throwRangeError('@ltd/j-ts(,esv)')
							: Latest,
						false,
						TS,
					)
				)
		};
	}
	finally { ts = ''; }
}
function from (node      )         {
	// remove import type; export type...// export var type; // import * as
	switch ( node.kind ) {
		case TypeAliasDeclaration:
		case InterfaceDeclaration:
		case ModuleDeclaration:
			return remove(ts.slice(node.pos, node.end));
		case EnumDeclaration:
			throw Error('enum');
	}
	let ts_index         = node.pos;
	let firstChild                  ;
	forEachChild(node, function (child      ) {
		if ( !firstChild && ts_index===child.pos ) { firstChild = child; }
	});
	if ( firstChild && firstChild.kind===DeclareKeyword ) { return remove(ts.slice(node.pos, node.end)); }
	const es           = [];
	switch ( node.kind ) {
		//case ReturnStatement:// return|throw|yield <>///*\n*/1; -> 0,///*\n*/1,
		//case ThrowStatement:// (throw 1);
		//case YieldExpression:
		//	break;
		case TypeAssertionExpression:
			forEachChild(node, function (child      ) {
				switch ( es.length ) {
					case 0:
						es.push(ts.slice(ts_index, child.pos-1)+remove(ts.slice(child.pos-1, child.end)));
						break;
					case 1:
						es.push(ts.slice(ts_index, child.pos-1)+' '+from(child));
						break;
					default:
						throw Error(''+es.length);
				}
				ts_index = child.end;
			});
			if ( es.length!==2 ) { throw Error(''+es.length); }
			break;
		case AsExpression:
			forEachChild(node, function (child      ) {
				switch ( es.length ) {
					case 0:
						es.push(from(child));
						break;
					case 1:
						es.push(ts.slice(ts_index, child.pos-2)+remove(ts.slice(child.pos-2, child.end)));
						break;
					default:
						throw Error(''+es.length);
				}
				ts_index = child.end;
			});
			if ( es.length!==2 ) { throw Error(''+es.length); }
			break;
		case HeritageClause:
			let i         ;
			forEachChild(node, function (child      ) {
				if ( es.length ) {
					if ( i ) {
						es.push(remove(ts.slice(ts_index, child.end)));
						ts_index = child.end;
					}
					else { throw Error(''+es.length); }
				}
				else {
					i = ts.endsWith('implements', child.pos);
					if ( i ) {
						es.push(ts.slice(ts_index, child.pos-10)+remove(ts.slice(child.pos-10, child.end)));
						ts_index = child.end;
					}
					else {
						es.push(ts.slice(ts_index, ts_index = child.pos));
						const children                      = [];
						forEachChild(child, function (child      ) {
							if ( ts_index!==child.pos ) { children.push(child.pos); }
							children.push(child);
							ts_index = child.end;
						});
						es.push(
							children.length>1 && ( children[0]         ).kind===Identifier
								? ts.slice(( children[0]         ).pos, ( children[1]           )-1)+remove(ts.slice(( children[1]           )-1, child.end))
								: from(child)
						);
					}
				}
			});
			if ( !es.length ) { throw Error(''+es.length); }
			break;
		case CallExpression:
		case NewExpression:
			const children                      = [];
			forEachChild(node, function (child      ) {
				if ( ts_index!==child.pos ) { children.push(ts.slice(ts_index, child.pos)); }
				children.push(child);
				ts_index = child.end;
			});
			if ( ts_index!==node.end ) { children.push(ts.slice(ts_index, node.end)); }
			if ( node.kind===NewExpression ) { es.push(children.shift()          ); }
			es.push(from(children.shift()        ));
			if ( !children.length ) { break; }
			if ( ( children[0]           ).endsWith('<') ) {
				es.push(( children.shift()           ).slice(0, -1)+' ');
				while ( children.length ) {
					const child                = children.shift() ;
					if ( typeof child==='string' ) {
						if ( GT.test(child) ) {
							es.push(removeFirstGT(child));
							break;
						}
						else { es.push(remove(child)); }
					}
					else { es.push(remove(ts.slice(child.pos, child.end))); }
				}
			}
			while ( children.length ) {
				const child                = children.shift() ;
				if ( typeof child==='string' ) { es.push(child); }
				else { es.push(from(child)); }
			}
			break;
		case FunctionDeclaration:
		case MethodDeclaration:
			let declaration = true;
			forEachChild(node, function (child      ) {
				if ( declaration && child.kind===Block ) { declaration = false; }
			});
			if ( declaration ) { return remove(ts.slice(node.pos, node.end)); }
		case FunctionExpression:
		case GetAccessor:
		case SetAccessor:
			let notYet          = true;
			let thisNode                  ;
			forEachChild(node, function (child      ) {
				if ( thisNode ) {
					const { end }       = thisNode;
					thisNode.end = end+ts.slice(end, child.pos).search(COMMA)+1;
					thisNode = undefined$1;
				}
				if ( notYet && child.kind===Parameter ) {
					notYet = false;
					const maybeThis         = from(child);
					if ( THIS.test(maybeThis) ) {
						child.kind = TypeAliasDeclaration;
						thisNode = child;
					}
				}
			});
		case ClassDeclaration:
		case ClassExpression:
		case ArrowFunction:
			let gt          = false;
			forEachChild(node, function (child      ) {
				if ( child.kind===TypeParameter ) {
					if ( gt ) { es.push(remove(ts.slice(ts_index, child.end))); }
					else {
						es.push(ts.slice(ts_index, child.pos-1)+remove(ts.slice(child.pos-1, child.end)));
						gt = true;
					}
				}
				else if ( afterColon(child) ) {
					if ( gt ) {
						gt = false;
						es.push(removeFirstGT(ts.slice(ts_index, child.pos-1))+' ');
					}
					else { es.push(ts.slice(ts_index, child.pos-1)+' '); }
					es.push(remove(ts.slice(child.pos, child.end)));
				}
				else {
					if ( gt ) {
						gt = false;
						es.push(removeFirstGT(ts.slice(ts_index, child.pos)));
					}
					else if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
					es.push(from(child));
				}
				ts_index = child.end;
			});
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
		case VariableDeclaration:
		case PropertyDeclaration:
			forEachChild(node, function (child      ) {
				if ( ts_index===child.pos ) { es.push(from(child)); }
				else if ( afterColon(child) ) { es.push(ts.slice(ts_index, child.pos-1)+remove(ts.slice(child.pos-1, child.end))); }
				else { es.push(ts.slice(ts_index, child.pos)+from(child)); }
				ts_index = child.end;
			});
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
		case Parameter:
			forEachChild(node, function (child      ) {
				if ( afterColon(child) ) { es.push(ts.slice(ts_index, child.pos-1)+remove(ts.slice(child.pos-1, child.end))); }
				else if ( child.kind===QuestionToken ) { es.push(ts.slice(ts_index, child.end-1)+' '); }
				else {
					if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
					es.push(from(child));
				}
				ts_index = child.end;
			});
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
		case NonNullExpression:
			forEachChild(node, function (child      ) {
				if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
				es.push(from(child));
				ts_index = child.end;
			});
			es.push(ts.slice(ts_index, node.end-1)+' ');
			break;
		case EndOfFileToken:
			if ( node.pos!==node.end ) { es.push(ts.slice(node.pos, node.end)); }
			break;
		default:
			forEachChild(node, function (child      ) {
				if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
				es.push(from(child));
				ts_index = child.end;
			});
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
	}
	return es.join('');
}

const create = Object.create;

const assign = Object.assign;

const hasOwnProperty = Object.prototype.hasOwnProperty;

const toStringTag = typeof Symbol!=='undefined' ? Symbol.toStringTag : undefined;

const defineProperty = Object.defineProperty;

const freeze = Object.freeze;

const seal = Object.seal;

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		return /*#__PURE__*/ function Module (exports, addOnOrigin) {
			if ( !addOnOrigin ) { addOnOrigin = exports; exports = create(null); }
			if ( assign ) { assign(exports, addOnOrigin); }
			else { for ( var key in addOnOrigin ) { if ( hasOwnProperty.call(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
			exports['default'] = exports;
			typeof exports==='function' && exports.prototype && seal(exports.prototype);
			if ( toStringTag ) {
				var descriptor = create(null);
				descriptor.value = 'Module';
				defineProperty(exports, toStringTag, descriptor);
			}
			return freeze(exports);
		}(exports, addOnOrigin);
	}
	/*¡ j-globals: default (internal) */
);

const _default = Default(transpileModule, {
	transpileModule,
	version,
});

module.exports = _default;

//# sourceMappingURL=index.js.map
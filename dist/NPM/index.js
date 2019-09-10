'use strict';

const version = '6.0.2';

const undefined$1 = void 0;

const {
	transpileModule: _transpileModule,
	createSourceFile,
	forEachChild,
	JsxEmit: { None, Preserve, React, ReactNative },
	ScriptTarget: { ESNext },
	ScriptKind: { TS, TSX },
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
		ReadonlyKeyword,
		PrivateKeyword,
		ProtectedKeyword,
		PublicKeyword,
		ExportAssignment,
		ImportEqualsDeclaration,
		ReturnStatement,
		ThrowStatement,
		YieldExpression,
		ParenthesizedType,
		ConstructorType,
		IndexSignature,
		AbstractKeyword,
		//NamespaceExportDeclaration,
	},
} = require('typescript');

const S = /\S/g;
const remove = (exp        )         => exp.replace(S, ' ');

const GT = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*)>/;
const removeFirstGT = (exp        )         => exp.replace(GT, ' ');

const SHEBANG = /(?<=^\uFEFF?#!.*)/;
const HASH = /#/g;
const THIS = /^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*this(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*$/;
const COMMA = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*),/;

const EOL = /[\n\r\u2028\u2029]/;
const WHITE = /(?<=^(?:\s+|\/(?:\/.*|\*.*?\*\/)))/s;
const STRUCTURE = {
	[ReturnStatement]: 'return',
	[ThrowStatement]: 'throw',
	[YieldExpression]: 'yield',
};
function EOL_VALUE_test (literal        )          {
	for ( ; ; ) {
		const index         = literal.search(WHITE);
		if ( index<0 ) { return false; }
		if ( EOL.test(literal.slice(0, index)) ) { return true; }
		literal = literal.slice(index);
	}
}

const hashes           = [];
let ts         = '';
let childNodes         = [];

                                                                                                                                                  
                                                                                                                                                                                                                                     
function transpileModule (input        , jsx_transpileOptions                                                            )                                                                                            {
	try {
		ts = coverHash(input);
		if ( typeof jsx_transpileOptions==='object' ) {
			let scriptKind;
			const { compilerOptions } = jsx_transpileOptions;
			if ( compilerOptions ) {
				const { jsx } = compilerOptions;
				switch ( jsx ) {
					case undefined$1:
					case None:
					case 'None':
						scriptKind = TS;
						break;
					case Preserve:
					case ReactNative:
					case 'Preserve':
					case 'ReactNative':
						scriptKind = TSX;
						break;
					case React:
					case 'React':
						throw Error('transpileModule(,{ compilerOptions: { jsx: React } })');
					default:
						throw Error('transpileModule(,{ compilerOptions: { jsx! } })');
				}
			}
			else { scriptKind = TS; }
			const { diagnostics } = _transpileModule(ts, jsx_transpileOptions);
			return {
				outputText: recoverHash(from(createSourceFile('', ts, ESNext, false, scriptKind))),
				diagnostics,
				sourceMapText: undefined$1,
			};
		}
		else {
			return recoverHash(from(createSourceFile('', ts, ESNext, false, jsx_transpileOptions===true ? TSX : TS)));
		}
	}
	finally {
		hashes.length = 0;
		ts = '';
	}
}
function coverHash (origin        )         {
	const start         = origin.search(SHEBANG)+1;
	for ( let position         = start; ;++position ) {
		position = origin.indexOf('#', position);
		if ( position<0 ) { break; }
		hashes.push(position);
	}
	return hashes.length ? origin.slice(0, start)+origin.slice(start).replace(HASH, '_') : origin;
}
function recoverHash (covered        )         {
	const { length } = hashes;
	if ( length ) {
		const chars           = covered.split('');
		let index         = 0;
		do {
			const position         = hashes[index];
			if ( chars[position]==='_' ) { chars[position] = '#'; }
		}
		while ( ++index<length )
		return chars.join('');
	}
	return covered;
}

function childNodes_push (child      )       { childNodes.push(child); }
function ChildNodes (node      )         {
	try {
		forEachChild(node, childNodes_push);
		return childNodes;
	}
	finally { childNodes = []; }
}
function Children (childNodes        , ts_index        , node_end        )           {
	const children           = [];
	for ( let { length } = childNodes, index         = 0; index<length; ++index ) {
		const child       = childNodes[index];
		if ( ts_index!==child.pos ) { children.push(ts.slice(ts_index, child.pos)); }
		children.push(child);
		ts_index = child.end;
	}
	if ( ts_index!==node_end ) { children.push(ts.slice(ts_index, node_end)); }
	return children;
}

function afterColon (node      )          {
	switch ( node.kind ) {
		case ParenthesizedType:
		case IndexedAccessType:
		case IntersectionType:
		case ConditionalType:
		case ConstructorType:
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

function from (node      )         {
	switch ( node.kind ) {
		//case NamespaceExportDeclaration:
		case TypeAliasDeclaration:
		case InterfaceDeclaration:
		case ModuleDeclaration:
		case ProtectedKeyword:
		case ReadonlyKeyword:
		case PrivateKeyword:
		case PublicKeyword:
		case IndexSignature:
		case AbstractKeyword:
			return remove(ts.slice(node.pos, node.end));
		case EnumDeclaration:
			throw Error('enum _ { }');
		case ImportEqualsDeclaration:
			throw Error('import _ = require( );');
	}
	const childNodes         = ChildNodes(node);
	if ( childNodes.length ) {
		if ( childNodes[0].kind===DeclareKeyword ) { return remove(ts.slice(node.pos, node.end)); }
		if ( node.kind===ExportAssignment ) {
			const { pos }       = childNodes[0];
			if ( pos!==node.pos && ts.endsWith('=', pos) ) { throw Error('export = _;'); }
		}
	}
	let ts_index         = node.pos;
	const es           = [];
	switch ( node.kind ) {
		case TypeAssertionExpression: {
			if ( childNodes.length!==2 ) { throw Error(''+childNodes.length); }
			const { pos, end }       = childNodes[0];
			es.push(
				ts.slice(ts_index, pos-1)+remove(ts.slice(pos-1, end))
				+
				ts.slice(end, childNodes[1].pos-1)+' '+from(childNodes[1])
			);
			break;
		}
		case AsExpression: {
			if ( childNodes.length!==2 ) { throw Error(''+childNodes.length); }
			const { pos, end }       = childNodes[1];
			es.push(
				from(childNodes[0])
				+
				ts.slice(childNodes[0].end, pos-2)+remove(ts.slice(pos-2, end))
			);
			break;
		}
		case HeritageClause: {
			let i          = false;
			if ( !childNodes.length ) { throw Error(''+childNodes.length); }
			for ( const child of childNodes ) {
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
			}
			break;
		}
		case CallExpression:
		case NewExpression: {
			const children           = Children(childNodes, ts_index, /*ts_index = */node.end);
			let index         = 0;
			if ( node.kind===NewExpression ) { es.push(children[index++]          ); }
			es.push(from(children[index++]        ));
			const { length } = children;
			if ( index===length ) { break; }
			if ( ( children[index]           ).endsWith('<') ) {
				es.push(( children[index++]           ).slice(0, -1)+' ');
				while ( index!==length ) {
					const child                = children[index++];
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
			while ( index!==length ) {
				const child                = children[index++];
				es.push(typeof child==='string' ? child : from(child));
			}
			break;
		}
		case FunctionDeclaration:
		case MethodDeclaration: {
			let declaration          = true;
			for ( const child of childNodes ) {
				if ( child.kind===Block ) {
					declaration = false;
					break;
				}
			}
			if ( declaration ) { return remove(ts.slice(node.pos, node.end)); }
		}
		case FunctionExpression:
		case GetAccessor:
		case SetAccessor:
			for ( let { length } = childNodes, index         = 0; index<length; ++index ) {
				const child       = childNodes[index];
				if ( child.kind===Parameter ) {
					const maybeThis         = from(child);
					if ( THIS.test(maybeThis) ) {
						child.kind = TypeAliasDeclaration;
						const { end }       = child;
						const indexOfComma         = ts.slice(end, childNodes[index+1].pos).search(COMMA);
						if ( indexOfComma>=0 ) { child.end = end+indexOfComma+1; }
					}
					break;
				}
			}
		case ClassDeclaration:
		case ClassExpression:
		case ArrowFunction: {
			let gt          = false;
			for ( const child of childNodes ) {
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
			}
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
		}
		case VariableDeclaration:
			for ( const child of childNodes ) {
				if ( ts_index===child.pos ) { es.push(from(child)); }
				else if ( afterColon(child) ) { es.push(ts.slice(ts_index, child.pos-1)+remove(ts.slice(child.pos-1, child.end))); }
				else { es.push(ts.slice(ts_index, child.pos)+from(child)); }
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
		case PropertyDeclaration:
		case Parameter:
			for ( const child of childNodes ) {
				if ( afterColon(child) ) { es.push(ts.slice(ts_index, child.pos-1)+remove(ts.slice(child.pos-1, child.end))); }
				else if ( child.kind===QuestionToken ) { es.push(ts.slice(ts_index, child.end-1)+' '); }
				else {
					if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
					es.push(from(child));
				}
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
		case NonNullExpression:
			for ( const child of childNodes ) {
				if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
				es.push(from(child));
				ts_index = child.end;
			}
			es.push(ts.slice(ts_index, node.end-1)+' ');
			break;
		case ReturnStatement:
		case ThrowStatement:
		case YieldExpression:
			switch ( childNodes.length ) {
				case 0:
					if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
					break;
				case 1:
					const child       = childNodes[0];
					if ( child.kind===TypeAssertionExpression ) {
						const { 0: type, 1: value }         = ChildNodes(child);
						if ( EOL.test(ts.slice(type.pos, value.pos)) ) { throw Error(`${STRUCTURE[node.kind]} <type (EOL)> value`); }
						if ( EOL_VALUE_test(from(value)) ) { throw Error(`${STRUCTURE[node.kind]} <type> (EOL) value`); }
					}
					if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
					es.push(from(child));
					ts_index = child.end;
					if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
					break;
				case 2:
					for ( const child of childNodes ) {
						if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
						es.push(from(child));
						ts_index = child.end;
					}
					if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
					break;
				default:
					throw Error(''+childNodes.length);
			}
			break;
		case EndOfFileToken:
			if ( node.pos!==node.end ) { es.push(ts.slice(node.pos, node.end)); }
			break;
		default:
			for ( const child of childNodes ) {
				if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
				es.push(from(child));
				ts_index = child.end;
			}
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

const NULL = (
	/*! j-globals: null.prototype (internal) */
	Object.create
		? /*#__PURE__*/ Object.preventExtensions(Object.create(null))
		: null
	/*¡ j-globals: null.prototype (internal) */
);

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		return /*#__PURE__*/ function Module (exports, addOnOrigin) {
			if ( !addOnOrigin ) { addOnOrigin = exports; exports = create(NULL); }
			if ( assign ) { assign(exports, addOnOrigin); }
			else { for ( var key in addOnOrigin ) { if ( hasOwnProperty.call(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
			exports['default'] = exports;
			typeof exports==='function' && exports.prototype && seal(exports.prototype);
			if ( toStringTag ) {
				var descriptor = create(NULL);
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
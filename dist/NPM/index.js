﻿'use strict';

const version = '6.3.1';

const Error$1 = Error;

const TypeError$1 = TypeError;

const undefined$1 = void null;

const {
	transpileModule: TypeScript_transpileModule,
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
		ThisType,
		//NamespaceExportDeclaration,
		ExportDeclaration,
		ImportDeclaration,
		ImportClause,
		Constructor,
		ExclamationToken,
		ExpressionWithTypeArguments,
		TaggedTemplateExpression,
		TemplateLiteralType,
		OverrideKeyword,
	},
}                              = require('typescript');

const throwPos = (pos        , error                          )        => {
	error.pos = pos;
	throw error;
};

const S = /\S/g;
const remove = (exp        ) => exp.replace(S, ' ');

const GT = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*)>/;
const removeFirstGT = (exp        ) => exp.replace(GT, ' ');

const THIS = /^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*this(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*$/;
const COMMA = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*),/;

const EOL = /[\n\r\u2028\u2029]/;
const WHITE = /(?<=^(?:\s+|\/(?:\/.*|\*.*?\*\/)))/s;
const STRUCTURE = {
	[ReturnStatement]: 'return',
	[ThrowStatement]: 'throw',
	[YieldExpression]: 'yield',
}         ;

let ts         = '';
let childNodes         = [];

const childNodes_push = (child      ) => { childNodes[childNodes.length] = child; };
const ChildNodes = (node      )                  => {
	try {
		forEachChild(node       , childNodes_push);
		return childNodes;
	}
	finally { childNodes = []; }
};

const afterColon = (node      ) => {
	switch ( node.kind ) {
		case TemplateLiteralType:
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
		case ThisType:
		
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
};

const from = (node      )         => {
	let ts_index = node.pos;
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
		case ExclamationToken:
		case OverrideKeyword:
			return remove(ts.slice(ts_index, node.end));
		case EnumDeclaration:
			throwPos(ChildNodes(node)[0] .pos - 4, Error$1('enum'));
		case ImportEqualsDeclaration:
			throwPos(ChildNodes(node)[1] .pos - 1, Error$1('import='));
	}
	const childNodes = ChildNodes(node);
	const childNodes_length = childNodes.length;
	if ( childNodes_length ) {
		let index = 0;
		do { if ( childNodes[index] .kind===DeclareKeyword ) { return remove(ts.slice(ts_index, node.end)); } }
		while ( ++index!==childNodes_length );
		switch ( node.kind ) {
			case ImportDeclaration:
				const child = childNodes[0] ;
				if ( child.kind===ImportClause ) {
					const { pos } = ChildNodes(child)[0] ;
					if ( pos!==child.pos && ts.endsWith('type', pos) ) { return remove(ts.slice(ts_index, node.end)); }
				}
				break;
			case ExportDeclaration: {
				const { pos } = childNodes[0] ;
				if ( pos!==ts_index && ts.endsWith('type', pos) ) { return remove(ts.slice(ts_index, node.end)); }
				break;
			}
			case ExportAssignment: {
				const { pos } = childNodes[0] ;
				if ( pos!==ts_index && ts.endsWith('=', pos) ) { throwPos(pos - 1, Error$1('export=')); }
				break;
			}
		}
	}
	const es           = [];
	switch ( node.kind ) {
		case TypeAssertionExpression: {
			if ( childNodes_length!==2 ) { throw Error$1('TypeAssertionExpression ' + childNodes_length); }
			const { pos, end } = childNodes[0] ;
			return ts.slice(ts_index, pos - 1) + remove(ts.slice(pos - 1, end)) + ts.slice(end, childNodes[1] .pos - 1) + ' ' + from(childNodes[1] );
		}
		case AsExpression: {
			if ( childNodes_length!==2 ) { throw Error$1('AsExpression ' + childNodes_length); }
			const { pos, end } = childNodes[1] ;
			return from(childNodes[0] ) + ts.slice(childNodes[0] .end, pos - 2) + remove(ts.slice(pos - 2, end));
		}
		case HeritageClause: {
			let i = false;
			if ( !childNodes_length ) { throw Error$1('HeritageClause ' + childNodes_length); }
			let index = 0;
			do {
				const child = childNodes[index++] ;
				if ( es.length ) {
					if ( !i ) { throw Error$1('HeritageClause ' + es.length); }
					es[es.length] = remove(ts.slice(ts_index, child.end));
				}
				else {
					es[es.length] = ( i = ts.endsWith('implements', child.pos) )
						? ts.slice(ts_index, child.pos - 10) + remove(ts.slice(child.pos - 10, child.end))
						: ts.slice(ts_index, child.pos) + from(child);
				}
				ts_index = child.end;
			}
			while ( index!==childNodes_length );
			break;
		}
		case CallExpression:
		case NewExpression:
		case TaggedTemplateExpression: {
			const children = [];
			let index = 0;
			for ( const { length } = childNodes; index!==length; ++index ) {
				const child = childNodes[index] ;
				if ( ts_index!==child.pos ) { children[children.length] = ts.slice(ts_index, child.pos); }
				children[children.length] = child;
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { children[children.length] = ts.slice(ts_index, node.end); }//ts_index = node.end;
			index = 0;
			if ( node.kind===NewExpression ) { es[es.length] = children[index++]          ; }
			es[es.length] = from(children[index++]        );
			const { length } = children;
			if ( index===length ) { break; }
			if ( typeof children[index]==='object' ) {
				es[es.length] = from(children[index++]        );
				if ( index===length ) { break; }
			}
			if ( ( children[index]           ).endsWith('<') ) {
				es[es.length] = ( children[index++]           ).slice(0, -1) + ' ';
				while ( index!==length ) {
					const child = children[index++] ;
					if ( typeof child==='string' ) {
						if ( GT.test(child) ) {
							es[es.length] = removeFirstGT(child);
							break;
						}
						else { es[es.length] = remove(child); }
					}
					else { es[es.length] = remove(ts.slice(child.pos, child.end)); }
				}
			}
			while ( index!==length ) {
				const child = children[index++] ;
				es[es.length] = typeof child==='string' ? child : from(child);
			}
			break;
		}
		case MethodDeclaration:
		case GetAccessor:
		case SetAccessor:
		case Constructor:
		case FunctionDeclaration: {
			let declaration = true;
			let index = 0;
			for ( ; index!==childNodes_length; ++index ) {
				if ( childNodes[index] .kind===Block ) {
					declaration = false;
					break;
				}
			}
			if ( declaration ) { return remove(ts.slice(node.pos, node.end)); }
		}
		case FunctionExpression: {
			let index = 0;
			for ( ; index!==childNodes_length; ++index ) {
				const child = childNodes[index] ;
				if ( child.kind===Parameter ) {
					const maybeThis = from(child);
					if ( THIS.test(maybeThis) ) {
						child.kind = TypeAliasDeclaration;
						const { end } = child;
						const indexAfterComma = ts.slice(end, childNodes[index + 1] .pos).search(COMMA) + 1;
						if ( indexAfterComma ) { child.end = end + indexAfterComma; }
					}
					break;
				}
			}
		}
		case ClassDeclaration:
		case ClassExpression:
		case ArrowFunction: {
			let gt = false;
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++] ;
				if ( child.kind===TypeParameter ) {
					if ( gt ) { es[es.length] = remove(ts.slice(ts_index, child.end)); }
					else {
						es[es.length] = ts.slice(ts_index, child.pos - 1) + remove(ts.slice(child.pos - 1, child.end));
						gt = true;
					}
				}
				else if ( afterColon(child) ) {
					if ( gt ) {
						gt = false;
						es[es.length] = removeFirstGT(ts.slice(ts_index, child.pos - 1)) + ' ';
					}
					else { es[es.length] = ts.slice(ts_index, child.pos - 1) + ' '; }
					es[es.length] = remove(ts.slice(child.pos, child.end));
				}
				else {
					if ( gt ) {
						gt = false;
						es[es.length] = removeFirstGT(ts.slice(ts_index, child.pos));
					}
					else if ( ts_index!==child.pos ) { es[es.length] = ts.slice(ts_index, child.pos); }
					es[es.length] = child.kind===QuestionToken && node.kind===MethodDeclaration
						? ts.slice(ts_index, child.end - 1) + ' '
						: from(child);
				}
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) {
				es[es.length] = gt
					? removeFirstGT(ts.slice(ts_index, node.end))
					: ts.slice(ts_index, node.end);
			}
			break;
		}
		case VariableDeclaration: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++] ;
				if ( ts_index===child.pos ) { es[es.length] = from(child); }
				else if ( afterColon(child) ) { es[es.length] = ts.slice(ts_index, child.pos - 1) + remove(ts.slice(child.pos - 1, child.end)); }
				else { es[es.length] = ts.slice(ts_index, child.pos) + from(child); }
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { es[es.length] = ts.slice(ts_index, node.end); }
			break;
		}
		case PropertyDeclaration: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++] ;
				if ( afterColon(child) ) { es[es.length] = ts.slice(ts_index, child.pos - 1) + remove(ts.slice(child.pos - 1, child.end)); }
				else if ( child.kind===QuestionToken ) { es[es.length] = ts.slice(ts_index, child.end - 1) + ' '; }
				else {
					if ( child.kind===AbstractKeyword ) { throwPos(child.end - 8, Error$1('abstract field expect declare')); }
					if ( ts_index!==child.pos ) { es[es.length] = ts.slice(ts_index, child.pos); }
					es[es.length] = from(child);
				}
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { es[es.length] = ts.slice(ts_index, node.end); }
			break;
		}
		case Parameter: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++] ;
				if ( afterColon(child) ) { es[es.length] = ts.slice(ts_index, child.pos - 1) + remove(ts.slice(child.pos - 1, child.end)); }
				else {
					const { kind } = child;
					if ( kind===QuestionToken ) { es[es.length] = ts.slice(ts_index, child.end - 1) + ' '; }
					else if ( kind===ReadonlyKeyword ) { throwPos(child.end - 8, Error$1('parameter property is not supported (readonly)')); }
					else if ( kind===PublicKeyword ) { throwPos(child.end - 6, Error$1('parameter property is not supported (public)')); }
					else if ( kind===ProtectedKeyword ) { throwPos(child.end - 9, Error$1('parameter property is not supported (protected)')); }
					else if ( kind===PrivateKeyword ) { throwPos(child.end - 7, Error$1('parameter property is not supported (private)')); }
					else {
						if ( ts_index!==child.pos ) { es[es.length] = ts.slice(ts_index, child.pos); }
						es[es.length] = from(child);
					}
				}
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { es[es.length] = ts.slice(ts_index, node.end); }
			break;
		}
		case NonNullExpression: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++] ;
				if ( ts_index!==child.pos ) { es[es.length] = ts.slice(ts_index, child.pos); }
				es[es.length] = from(child);
				ts_index = child.end;
			}
			es[es.length] = ts.slice(ts_index, node.end - 1) + ' ';
			break;
		}
		case ReturnStatement:
		case ThrowStatement:
		case YieldExpression:
			switch ( childNodes_length ) {
				case 0:
					if ( ts_index!==node.end ) { es[es.length] = ts.slice(ts_index, node.end); }
					break;
				case 1:
					const child = childNodes[0] ;
					if ( child.kind===TypeAssertionExpression ) {
						const { 0: type, 1: value } = ChildNodes(child);
						const index = ts.slice(type .pos, value .pos).search(EOL);
						if ( index>=0 ) { throwPos(type .pos + index, Error$1(STRUCTURE[node.kind] + ' <type (EOL)> value')); }
						let literal         = from(value );
						let offset         = 0;
						for ( ; ; ) {
							const index = literal.search(WHITE);
							if ( index<0 ) { break; }
							if ( EOL.test(literal.slice(0, index)) ) { throwPos(value .pos + offset + literal.search(EOL), Error$1(STRUCTURE[node.kind] + ' <type> (EOL) value')); }
							literal = literal.slice(index);
							offset += index;
						}
					}
					if ( ts_index!==child.pos ) { es[es.length] = ts.slice(ts_index, child.pos); }
					es[es.length] = from(child);
					ts_index = child.end;
					if ( ts_index!==node.end ) { es[es.length] = ts.slice(ts_index, node.end); }
					break;
				case 2:
					let index = 0;
					while ( index!==childNodes_length ) {
						const child = childNodes[index++] ;
						if ( ts_index!==child.pos ) { es[es.length] = ts.slice(ts_index, child.pos); }
						es[es.length] = from(child);
						ts_index = child.end;
					}
					if ( ts_index!==node.end ) { es[es.length] = ts.slice(ts_index, node.end); }
					break;
				default:
					throw Error$1(node.kind + ' ' + childNodes_length);
			}
			break;
		case ExpressionWithTypeArguments: {
			const child = childNodes[0] ;
			return from(child) + remove(ts.slice(child.end, node.end));
		}
		case EndOfFileToken:
			return node.pos===node.end ? '' : ts.slice(node.pos, node.end);
		default: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++] ;
				if ( ts_index!==child.pos ) { es[es.length] = ts.slice(ts_index, child.pos); }
				es[es.length] = from(child);
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { es[es.length] = ts.slice(ts_index, node.end); }
			break;
		}
	}
	return es.join('');
};

const transpileModule = (input        , jsx_transpileOptions                                                )                                                                                            => {
	ts = input;
	try {
		if ( typeof jsx_transpileOptions==='object' ) {
			let scriptKind                        ;
			switch ( jsx_transpileOptions.compilerOptions?.jsx ) {
				case undefined$1:
				case None:
				case 'None':
					scriptKind = TS;
					break;
				case Preserve:
				case ReactNative:
				case 'Preserve':
				case 'ReactNative':
				case 'preserve':
				case 'react-native':
					scriptKind = TSX;
					break;
				case React:
				case 'React':
				case 'react':
					throw TypeError$1('transpileModule(,{compilerOptions:{jsx:React}})');
				default:
					throw TypeError$1('transpileModule(,{compilerOptions:{jsx:unknown}})');
			}
			const { diagnostics } = TypeScript_transpileModule(ts, jsx_transpileOptions);
			return {
				outputText: from(createSourceFile('', ts, ESNext, false, scriptKind)),
				diagnostics,
				sourceMapText: undefined$1,
			};
		}
		else { return from(createSourceFile('', ts, ESNext, false, jsx_transpileOptions ? TSX : TS)); }
	}
	finally { ts = ''; }
};

const create = Object.create;

const toStringTag = typeof Symbol==='undefined' ? undefined$1 : Symbol.toStringTag;

const defineProperty = Object.defineProperty;

const freeze = Object.freeze;

const NULL = (
	/*! j-globals: null.prototype (internal) */
	Object.seal
		? /*#__PURE__*/Object.preventExtensions(Object.create(null))
		: null
	/*¡ j-globals: null.prototype (internal) */
);

const assign = Object.assign;

const hasOwnProperty = Object.prototype.hasOwnProperty;

var hasOwn = /*#__PURE__*/function () {
	return hasOwnProperty.bind
		? hasOwnProperty.call.bind(hasOwnProperty)
		: function (object, key) { return hasOwnProperty.call(object, key); };
}();// && object!=null

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		if ( !addOnOrigin ) { addOnOrigin = exports; exports = create(NULL); }
		if ( assign ) { assign(exports, addOnOrigin); }
		else { for ( var key in addOnOrigin ) { if ( hasOwn(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
		exports.default = exports;
		if ( toStringTag ) {
			var descriptor = create(NULL);
			descriptor.value = 'Module';
			defineProperty(exports, toStringTag, descriptor);
		}
		typeof exports==='function' && exports.prototype && freeze(exports.prototype);
		return freeze(exports);
	}
	/*¡ j-globals: default (internal) */
);

const _default = Default(transpileModule, {
	transpileModule,
	version,
});

module.exports = _default;

//# sourceMappingURL=index.js.map
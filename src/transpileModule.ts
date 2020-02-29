import Error from '.Error';
import undefined from '.undefined';

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
		ThisType,
		//NamespaceExportDeclaration,
		ExportDeclaration,
		ImportDeclaration,
		ImportClause,
	},
} = require('typescript');

const S = /\S/g;
const remove = (exp :string) => exp.replace(S, ' ');

const GT = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*)>/;
const removeFirstGT = (exp :string) => exp.replace(GT, ' ');

const THIS = /^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*this(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*$/;
const COMMA = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*),/;

const EOL = /[\n\r\u2028\u2029]/;
const WHITE = /(?<=^(?:\s+|\/(?:\/.*|\*.*?\*\/)))/s;
const STRUCTURE = {
	[ReturnStatement]: 'return',
	[ThrowStatement]: 'throw',
	[YieldExpression]: 'yield',
};
function EOL_VALUE_test (literal :string) {
	for ( ; ; ) {
		const index = literal.search(WHITE);
		if ( index<0 ) { return false; }
		if ( EOL.test(literal.slice(0, index)) ) { return true; }
		literal = literal.slice(index);
	}
}

const hashes :number[] = [];
let ts :string = '';
let childNodes :Node[] = [];

export default function transpileModule (input :string, jsx                 ? :boolean                                                  ) :string;
export default function transpileModule (input :string,     transpileOptions  :          { compilerOptions? :{ jsx? :number | string } }) :         { outputText :string, diagnostics :undefined | any[], sourceMapText :undefined };
export default function transpileModule (input :string, jsx_transpileOptions? :boolean | { compilerOptions? :{ jsx? :number | string } }) :string | { outputText :string, diagnostics :undefined | any[], sourceMapText :undefined } {
	ts = input;
	try {
		if ( typeof jsx_transpileOptions==='object' ) {
			let scriptKind;
			const { compilerOptions } = jsx_transpileOptions;
			if ( compilerOptions ) {
				const { jsx } = compilerOptions;
				switch ( jsx ) {
					case undefined:
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
				outputText: from(createSourceFile('', ts, ESNext, false, scriptKind)),
				diagnostics,
				sourceMapText: undefined,
			};
		}
		else {
			return from(createSourceFile('', ts, ESNext, false, jsx_transpileOptions===true ? TSX : TS));
		}
	}
	finally {
		hashes.length = 0;
		ts = '';
	}
};

function childNodes_push (child :Node) { childNodes.push(child); }
function ChildNodes (node :Node) :readonly Node[] {
	try {
		forEachChild(node, childNodes_push);
		return childNodes;
	}
	finally { childNodes = []; }
}
function Children (childNodes :readonly Node[], ts_index :number, node_end :number) :readonly ( Node | string )[] {
	const children = [];
	let index = 0;
	for ( const { length } = childNodes; index!==length; ++index ) {
		const child = childNodes[index];
		if ( ts_index!==child.pos ) { children.push(ts.slice(ts_index, child.pos)); }
		children.push(child);
		ts_index = child.end;
	}
	if ( ts_index!==node_end ) { children.push(ts.slice(ts_index, node_end)); }
	return children;
}

function afterColon (node :Node) {
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
}

function from (node :Node) :string {
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
			return remove(ts.slice(ts_index, node.end));
		case EnumDeclaration:
			throw Error('enum _ { }');
		case ImportEqualsDeclaration:
			throw Error('import _ = require( );');
	}
	const childNodes = ChildNodes(node);
	const childNodes_length = childNodes.length;
	if ( childNodes_length ) {
		let index = 0;
		do { if ( childNodes[index].kind===DeclareKeyword ) { return remove(ts.slice(ts_index, node.end)); } }
		while ( ++index!==childNodes_length )
		switch ( node.kind ) {
			case ImportDeclaration:
				const child = childNodes[0];
				if ( child.kind===ImportClause ) {
					const { pos } = ChildNodes(child)[0];
					if ( pos!==child.pos && ts.endsWith('type', pos) ) { return remove(ts.slice(ts_index, node.end)); }
				}
				break;
			case ExportDeclaration: {
				const { pos } = childNodes[0];
				if ( pos!==ts_index && ts.endsWith('type', pos) ) { return remove(ts.slice(ts_index, node.end)); }
				break;
			}
			case ExportAssignment: {
				const { pos } = childNodes[0];
				if ( pos!==ts_index && ts.endsWith('=', pos) ) { throw Error('export = _;'); }
				break;
			}
		}
	}
	const es :string[] = [];
	switch ( node.kind ) {
		case TypeAssertionExpression: {
			if ( childNodes_length!==2 ) { throw Error(''+childNodes_length); }
			const { pos, end } = childNodes[0];
			es.push(
				ts.slice(ts_index, pos-1)+remove(ts.slice(pos-1, end))
				+
				ts.slice(end, childNodes[1].pos-1)+' '+from(childNodes[1])
			);
			break;
		}
		case AsExpression: {
			if ( childNodes_length!==2 ) { throw Error(''+childNodes_length); }
			const { pos, end } = childNodes[1];
			es.push(
				from(childNodes[0])
				+
				ts.slice(childNodes[0].end, pos-2)+remove(ts.slice(pos-2, end))
			);
			break;
		}
		case HeritageClause: {
			let i = false;
			if ( !childNodes_length ) { throw Error(''+childNodes_length); }
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++];
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
						const children :( Node | number )[] = [];
						forEachChild(child, (child :Node) => {
							if ( ts_index!==child.pos ) { children.push(child.pos); }
							children.push(child);
							ts_index = child.end;
						});
						es.push(
							children.length>1 && ( children[0] as Node ).kind===Identifier
								? ts.slice(( children[0] as Node ).pos, ( children[1] as number )-1)+remove(ts.slice(( children[1] as number )-1, child.end))
								: from(child)
						);
					}
				}
			}
			break;
		}
		case CallExpression:
		case NewExpression: {
			const children = Children(childNodes, ts_index, /*ts_index = */node.end);
			let index = 0;
			if ( node.kind===NewExpression ) { es.push(children[index++] as string); }
			es.push(from(children[index++] as Node));
			const { length } = children;
			if ( index===length ) { break; }
			if ( ( children[index] as string ).endsWith('<') ) {
				es.push(( children[index++] as string ).slice(0, -1)+' ');
				while ( index!==length ) {
					const child = children[index++];
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
				const child = children[index++];
				es.push(typeof child==='string' ? child : from(child));
			}
			break;
		}
		case MethodDeclaration:
		case GetAccessor:
		case SetAccessor:
		case FunctionDeclaration: {
			let declaration = true;
			let index = 0;
			for ( ; index!==childNodes_length; ++index ) {
				if ( childNodes[index].kind===Block ) {
					declaration = false;
					break;
				}
			}
			if ( declaration ) { return remove(ts.slice(node.pos, node.end)); }
		}
		case FunctionExpression: {
			let index = 0;
			for ( ; index!==childNodes_length; ++index ) {
				const child = childNodes[index];
				if ( child.kind===Parameter ) {
					const maybeThis = from(child);
					if ( THIS.test(maybeThis) ) {
						child.kind = TypeAliasDeclaration;
						const { end } = child;
						const indexAfterComma = ts.slice(end, childNodes[index+1].pos).search(COMMA)+1;
						if ( indexAfterComma ) { child.end = end+indexAfterComma; }
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
				const child = childNodes[index++];
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
					es.push(child.kind===QuestionToken && node.kind===MethodDeclaration
						? ts.slice(ts_index, child.end-1)+' '
						: from(child)
					);
				}
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
		}
		case VariableDeclaration: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++];
				if ( ts_index===child.pos ) { es.push(from(child)); }
				else if ( afterColon(child) ) { es.push(ts.slice(ts_index, child.pos-1)+remove(ts.slice(child.pos-1, child.end))); }
				else { es.push(ts.slice(ts_index, child.pos)+from(child)); }
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
		}
		case PropertyDeclaration:
		case Parameter: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++];
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
		}
		case NonNullExpression: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++];
				if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
				es.push(from(child));
				ts_index = child.end;
			}
			es.push(ts.slice(ts_index, node.end-1)+' ');
			break;
		}
		case ReturnStatement:
		case ThrowStatement:
		case YieldExpression:
			switch ( childNodes_length ) {
				case 0:
					if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
					break;
				case 1:
					const child = childNodes[0];
					if ( child.kind===TypeAssertionExpression ) {
						const { 0: type, 1: value } = ChildNodes(child);
						if ( EOL.test(ts.slice(type.pos, value.pos)) ) { throw Error(`${STRUCTURE[node.kind]} <type (EOL)> value`); }
						if ( EOL_VALUE_test(from(value)) ) { throw Error(`${STRUCTURE[node.kind]} <type> (EOL) value`); }
					}
					if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
					es.push(from(child));
					ts_index = child.end;
					if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
					break;
				case 2:
					let index = 0;
					while ( index!==childNodes_length ) {
						const child = childNodes[index++];
						if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
						es.push(from(child));
						ts_index = child.end;
					}
					if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
					break;
				default:
					throw Error(''+childNodes_length);
			}
			break;
		case EndOfFileToken:
			if ( node.pos!==node.end ) { es.push(ts.slice(node.pos, node.end)); }
			break;
		default: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++];
				if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
				es.push(from(child));
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
		}
	}
	return es.join('');
}

type Node = { kind :number, readonly pos :number, end :number };
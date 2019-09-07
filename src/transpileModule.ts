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
		//NamespaceExportDeclaration,
	},
} = require('typescript');

const S = /\S/g;
const remove = (exp :string) :string => exp.replace(S, ' ');

const GT = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*)>/;
const removeFirstGT = (exp :string) :string => exp.replace(GT, ' ');

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
function EOL_VALUE_test (literal :string) :boolean {
	for ( ; ; ) {
		const index :number = literal.search(WHITE);
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
	try {
		ts = coverHash(input);
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
				outputText: recoverHash(from(createSourceFile('', ts, ESNext, false, scriptKind))),
				diagnostics,
				sourceMapText: undefined,
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
};

function coverHash (origin :string) :string {
	const start :number = origin.search(SHEBANG)+1;
	for ( let position :number = start; ;++position ) {
		position = origin.indexOf('#', position);
		if ( position<0 ) { break; }
		hashes.push(position);
	}
	return hashes.length ? origin.slice(0, start)+origin.slice(start).replace(HASH, '_') : origin;
}
function recoverHash (covered :string) :string {
	const { length } = hashes;
	if ( length ) {
		const chars :string[] = covered.split('');
		let index :number = 0;
		do {
			const position :number = hashes[index];
			if ( chars[position]==='_' ) { chars[position] = '#'; }
		}
		while ( ++index<length )
		return chars.join('');
	}
	return covered;
}

function childNodes_push (child :Node) :void { childNodes.push(child); }
function ChildNodes (node :Node) :Node[] {
	try {
		forEachChild(node, childNodes_push);
		return childNodes;
	}
	finally { childNodes = []; }
}
function Children (childNodes :Node[], ts_index :number, node_end :number) :Children {
	const children :Children = [];
	for ( let { length } = childNodes, index :number = 0; index<length; ++index ) {
		const child :Node = childNodes[index];
		if ( ts_index!==child.pos ) { children.push(ts.slice(ts_index, child.pos)); }
		children.push(child);
		ts_index = child.end;
	}
	if ( ts_index!==node_end ) { children.push(ts.slice(ts_index, node_end)); }
	return children;
}

function afterColon (node :Node) :boolean {
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

function from (node :Node) :string {
	switch ( node.kind ) {
		//case NamespaceExportDeclaration:
		case TypeAliasDeclaration:
		case InterfaceDeclaration:
		case ModuleDeclaration:
		case ProtectedKeyword:
		case ReadonlyKeyword:
		case PrivateKeyword:
		case PublicKeyword:
			return remove(ts.slice(node.pos, node.end));
		case EnumDeclaration:
			throw Error('enum');
		case ImportEqualsDeclaration:
			throw Error('import $ = require()');
	}
	const childNodes :Node[] = ChildNodes(node);
	if ( childNodes.length ) {
		if ( childNodes[0].kind===DeclareKeyword ) { return remove(ts.slice(node.pos, node.end)); }
		if ( node.kind===ExportAssignment ) {
			const { pos } :Node = childNodes[0];
			if ( pos!==node.pos && ts.endsWith('=', pos) ) { throw Error('export = $'); }
		}
	}
	let ts_index :number = node.pos;
	const es :string[] = [];
	switch ( node.kind ) {
		case TypeAssertionExpression: {
			if ( childNodes.length!==2 ) { throw Error(''+childNodes.length); }
			const { pos, end } :Node = childNodes[0];
			es.push(
				ts.slice(ts_index, pos-1)+remove(ts.slice(pos-1, end))
				+
				ts.slice(end, childNodes[1].pos-1)+' '+from(childNodes[1])
			);
			break;
		}
		case AsExpression: {
			if ( childNodes.length!==2 ) { throw Error(''+childNodes.length); }
			const { pos, end } :Node = childNodes[1];
			es.push(
				from(childNodes[0])
				+
				ts.slice(childNodes[0].end, pos-2)+remove(ts.slice(pos-2, end))
			);
			break;
		}
		case HeritageClause: {
			let i :boolean = false;
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
						const children :( Node | number )[] = [];
						forEachChild(child, function (child :Node) {
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
			const children :Children = Children(childNodes, ts_index, /*ts_index = */node.end);
			let index :number = 0;
			if ( node.kind===NewExpression ) { es.push(children[index++] as string); }
			es.push(from(children[index++] as Node));
			const { length } = children;
			if ( index===length ) { break; }
			if ( ( children[index] as string ).endsWith('<') ) {
				es.push(( children[index++] as string ).slice(0, -1)+' ');
				while ( index!==length ) {
					const child :Node | string = children[index++];
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
				const child :Node | string = children[index++];
				es.push(typeof child==='string' ? child : from(child));
			}
			break;
		}
		case FunctionDeclaration:
		case MethodDeclaration: {
			let declaration :boolean = true;
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
			for ( let { length } = childNodes, index :number = 0; index<length; ++index ) {
				const child :Node = childNodes[index];
				if ( child.kind===Parameter ) {
					const maybeThis :string = from(child);
					if ( THIS.test(maybeThis) ) {
						child.kind = TypeAliasDeclaration;
						const { end } :Node = child;
						const indexOfComma :number = ts.slice(end, childNodes[index+1].pos).search(COMMA);
						if ( indexOfComma>=0 ) { child.end = end+indexOfComma+1; }
					}
					break;
				}
			}
		case ClassDeclaration:
		case ClassExpression:
		case ArrowFunction: {
			let gt :boolean = false;
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
					const child :Node = childNodes[0];
					if ( child.kind===TypeAssertionExpression ) {
						const { 0: type, 1: value } :Node[] = ChildNodes(child);
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

type Node = { kind :number, pos :number, end :number };
type Children = ( Node | string )[];
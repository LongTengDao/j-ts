import Error from '.Error';
import undefined from '.undefined';

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
	},
} = require('typescript');

const throwPos = (pos :number, error :Error & { pos? :number }) :never => {
	error.pos = pos;
	throw error;
};

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
} as const;

let ts :string = '';
let childNodes :Node[] = [];

const childNodes_push = (child :Node) => { childNodes[childNodes.length] = child; };
const ChildNodes = (node :Node) :readonly Node[] => {
	try {
		forEachChild(node, childNodes_push);
		return childNodes;
	}
	finally { childNodes = []; }
};

const afterColon = (node :Node) => {
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
};

const from = (node :Node) :string => {
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
			throwPos(ChildNodes(node)[0]!.pos - 4, Error('enum'));
		case ImportEqualsDeclaration:
			throwPos(ChildNodes(node)[1]!.pos - 1, Error('import='));
	}
	const childNodes = ChildNodes(node);
	const childNodes_length = childNodes.length;
	if ( childNodes_length ) {
		let index = 0;
		do { if ( childNodes[index]!.kind===DeclareKeyword ) { return remove(ts.slice(ts_index, node.end)); } }
		while ( ++index!==childNodes_length );
		switch ( node.kind ) {
			case ImportDeclaration:
				const child = childNodes[0]!;
				if ( child.kind===ImportClause ) {
					const { pos } = ChildNodes(child)[0]!;
					if ( pos!==child.pos && ts.endsWith('type', pos) ) { return remove(ts.slice(ts_index, node.end)); }
				}
				break;
			case ExportDeclaration: {
				const { pos } = childNodes[0]!;
				if ( pos!==ts_index && ts.endsWith('type', pos) ) { return remove(ts.slice(ts_index, node.end)); }
				break;
			}
			case ExportAssignment: {
				const { pos } = childNodes[0]!;
				if ( pos!==ts_index && ts.endsWith('=', pos) ) { throwPos(pos - 1, Error('export=')); }
				break;
			}
		}
	}
	const es :string[] = [];
	switch ( node.kind ) {
		case TypeAssertionExpression: {
			if ( childNodes_length!==2 ) { throw Error('TypeAssertionExpression ' + childNodes_length); }
			const { pos, end } = childNodes[0]!;
			es[es.length] = ts.slice(ts_index, pos - 1) + remove(ts.slice(pos - 1, end)) + ts.slice(end, childNodes[1]!.pos - 1) + ' ' + from(childNodes[1]!);
			break;
		}
		case AsExpression: {
			if ( childNodes_length!==2 ) { throw Error('AsExpression ' + childNodes_length); }
			const { pos, end } = childNodes[1]!;
			es[es.length] = from(childNodes[0]!) + ts.slice(childNodes[0]!.end, pos - 2) + remove(ts.slice(pos - 2, end));
			break;
		}
		case HeritageClause: {
			let i = false;
			if ( !childNodes_length ) { throw Error('HeritageClause ' + childNodes_length); }
			let index = 0;
			do {
				const child = childNodes[index++]!;
				if ( es.length ) {
					if ( !i ) { throw Error('HeritageClause ' + es.length); }
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
		case NewExpression: {
			const children = [];
			let index = 0;
			for ( const { length } = childNodes; index!==length; ++index ) {
				const child = childNodes[index]!;
				if ( ts_index!==child.pos ) { children[children.length] = ts.slice(ts_index, child.pos); }
				children[children.length] = child;
				ts_index = child.end;
			}
			if ( ts_index!==node.end ) { children[children.length] = ts.slice(ts_index, node.end); }//ts_index = node.end;
			index = 0;
			if ( node.kind===NewExpression ) { es[es.length] = children[index++] as string; }
			es[es.length] = from(children[index++] as Node);
			const { length } = children;
			if ( index===length ) { break; }
			if ( typeof children[index]==='object' ) {
				es[es.length] = from(children[index++] as Node);
				if ( index===length ) { break; }
			}
			if ( ( children[index] as string ).endsWith('<') ) {
				es[es.length] = ( children[index++] as string ).slice(0, -1) + ' ';
				while ( index!==length ) {
					const child = children[index++]!;
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
				const child = children[index++]!;
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
				if ( childNodes[index]!.kind===Block ) {
					declaration = false;
					break;
				}
			}
			if ( declaration ) { return remove(ts.slice(node.pos, node.end)); }
		}
		case FunctionExpression: {
			let index = 0;
			for ( ; index!==childNodes_length; ++index ) {
				const child = childNodes[index]!;
				if ( child.kind===Parameter ) {
					const maybeThis = from(child);
					if ( THIS.test(maybeThis) ) {
						child.kind = TypeAliasDeclaration;
						const { end } = child;
						const indexAfterComma = ts.slice(end, childNodes[index + 1]!.pos).search(COMMA) + 1;
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
				const child = childNodes[index++]!;
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
			if ( ts_index!==node.end ) { es[es.length] = ts.slice(ts_index, node.end); }
			break;
		}
		case VariableDeclaration: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++]!;
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
				const child = childNodes[index++]!;
				if ( afterColon(child) ) { es[es.length] = ts.slice(ts_index, child.pos - 1) + remove(ts.slice(child.pos - 1, child.end)); }
				else if ( child.kind===QuestionToken || child.kind===ExclamationToken ) { es[es.length] = ts.slice(ts_index, child.end - 1) + ' '; }
				else {
					if ( child.kind===AbstractKeyword ) { throwPos(child.end - 8, Error('abstract field expect declare')); }
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
				const child = childNodes[index++]!;
				if ( afterColon(child) ) { es[es.length] = ts.slice(ts_index, child.pos - 1) + remove(ts.slice(child.pos - 1, child.end)); }
				else {
					const { kind } = child;
					if ( kind===QuestionToken ) { es[es.length] = ts.slice(ts_index, child.end - 1) + ' '; }
					else if ( kind===ReadonlyKeyword ) { throwPos(child.end - 8, Error('parameter property is not supported (readonly)')); }
					else if ( kind===PublicKeyword ) { throwPos(child.end - 6, Error('parameter property is not supported (public)')); }
					else if ( kind===ProtectedKeyword ) { throwPos(child.end - 9, Error('parameter property is not supported (protected)')); }
					else if ( kind===PrivateKeyword ) { throwPos(child.end - 7, Error('parameter property is not supported (private)')); }
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
				const child = childNodes[index++]!;
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
					const child = childNodes[0]!;
					if ( child.kind===TypeAssertionExpression ) {
						const { 0: type, 1: value } = ChildNodes(child);
						const index = ts.slice(type!.pos, value!.pos).search(EOL);
						if ( index>=0 ) { throwPos(type!.pos + index, Error(STRUCTURE[node.kind] + ' <type (EOL)> value')); }
						let literal :string = from(value!);
						let offset :number = 0;
						for ( ; ; ) {
							const index = literal.search(WHITE);
							if ( index<0 ) { break; }
							if ( EOL.test(literal.slice(0, index)) ) { throwPos(value!.pos + offset + literal.search(EOL), Error(STRUCTURE[node.kind] + ' <type> (EOL) value')); }
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
						const child = childNodes[index++]!;
						if ( ts_index!==child.pos ) { es[es.length] = ts.slice(ts_index, child.pos); }
						es[es.length] = from(child);
						ts_index = child.end;
					}
					if ( ts_index!==node.end ) { es[es.length] = ts.slice(ts_index, node.end); }
					break;
				default:
					throw Error(node.kind + ' ' + childNodes_length);
			}
			break;
		case ExpressionWithTypeArguments:
			if ( childNodes_length<2 ) { throw Error('ExpressionWithTypeArguments ' + childNodes_length); }
			es[es.length] = from(childNodes[0]!) + remove(ts.slice(childNodes[0]!.end, node.end));
			break;
		case EndOfFileToken:
			if ( node.pos!==node.end ) { es[es.length] = ts.slice(node.pos, node.end); }
			break;
		default: {
			let index = 0;
			while ( index!==childNodes_length ) {
				const child = childNodes[index++]!;
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

const transpileModule = (input :string, jsx_transpileOptions? :boolean | { compilerOptions :{ jsx? :number | 'None' | 'Preserve' | 'ReactNative' } }) :string | { outputText :string, diagnostics :undefined | any[], sourceMapText :undefined } => {
	ts = input;
	try {
		if ( typeof jsx_transpileOptions==='object' ) {
			let scriptKind;
			switch ( jsx_transpileOptions.compilerOptions.jsx ) {
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
					throw Error('transpileModule(,{compilerOptions:{jsx:React}})');
				default:
					throw Error('transpileModule(,{compilerOptions:{jsx:unknown}})');
			}
			const { diagnostics } = TypeScript_transpileModule(ts, jsx_transpileOptions);
			return {
				outputText: from(createSourceFile('', ts, ESNext, false, scriptKind)),
				diagnostics,
				sourceMapText: undefined,
			};
		}
		else { return from(createSourceFile('', ts, ESNext, false, jsx_transpileOptions===true ? TSX : TS)); }
	}
	finally { ts = ''; }
};

export { transpileModule as default };

type Node = { kind :number, readonly pos :number, end :number };
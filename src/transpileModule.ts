import Error from '.Error';
import throwRangeError from '.throw.RangeError';
import undefined from '.undefined';

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
const remove = (exp :string) :string => exp.replace(S, ' ');

const GT = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*)>/;
const removeFirstGT = (exp :string) :string => exp.replace(GT, ' ');

const THIS = /^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*this(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*$/;
const COMMA = /(?<=^(?:\s+|\/(?:\/.*[\n\r\u2028\u2029]|\*[^]*?\*\/))*),/;

function afterColon (node :Node) :boolean {
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

let ts :string = '';

export default function transpileModule (input :string, esv? :3 | 5) :{ outputText :string } {
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
};

function from (node :Node) :string {
	// remove import type; export type...// export var type; // import * as
	switch ( node.kind ) {
		case TypeAliasDeclaration:
		case InterfaceDeclaration:
		case ModuleDeclaration:
			return remove(ts.slice(node.pos, node.end));
		case EnumDeclaration:
			throw Error('enum');
	}
	let ts_index :number = node.pos;
	let firstChild :Node | undefined;
	forEachChild(node, function (child :Node) {
		if ( !firstChild && ts_index===child.pos ) { firstChild = child; }
	});
	if ( firstChild && firstChild.kind===DeclareKeyword ) { return remove(ts.slice(node.pos, node.end)); }
	const es :string[] = [];
	switch ( node.kind ) {
		//case ReturnStatement:// return|throw|yield <>///*\n*/1; -> 0,///*\n*/1,
		//case ThrowStatement:// (throw 1);
		//case YieldExpression:
		//	break;
		case TypeAssertionExpression:
			forEachChild(node, function (child :Node) {
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
			forEachChild(node, function (child :Node) {
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
			let i :boolean;
			forEachChild(node, function (child :Node) {
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
			});
			if ( !es.length ) { throw Error(''+es.length); }
			break;
		case CallExpression:
		case NewExpression:
			const children :( Node | string )[] = [];
			forEachChild(node, function (child :Node) {
				if ( ts_index!==child.pos ) { children.push(ts.slice(ts_index, child.pos)); }
				children.push(child);
				ts_index = child.end;
			});
			if ( ts_index!==node.end ) { children.push(ts.slice(ts_index, node.end)); }
			if ( node.kind===NewExpression ) { es.push(children.shift() as string); }
			es.push(from(children.shift() as Node));
			if ( !children.length ) { break; }
			if ( ( children[0] as string ).endsWith('<') ) {
				es.push(( children.shift() as string ).slice(0, -1)+' ');
				while ( children.length ) {
					const child :Node | string = children.shift()!;
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
				const child :Node | string = children.shift()!;
				if ( typeof child==='string' ) { es.push(child); }
				else { es.push(from(child)); }
			}
			break;
		case FunctionDeclaration:
		case MethodDeclaration:
			let declaration = true;
			forEachChild(node, function (child :Node) {
				if ( declaration && child.kind===Block ) { declaration = false; }
			});
			if ( declaration ) { return remove(ts.slice(node.pos, node.end)); }
		case FunctionExpression:
		case GetAccessor:
		case SetAccessor:
			let notYet :boolean = true;
			let thisNode :Node | undefined;
			forEachChild(node, function (child :Node) {
				if ( thisNode ) {
					const { end } :Node = thisNode;
					thisNode.end = end+ts.slice(end, child.pos).search(COMMA)+1;
					thisNode = undefined;
				}
				if ( notYet && child.kind===Parameter ) {
					notYet = false;
					const maybeThis :string = from(child);
					if ( THIS.test(maybeThis) ) {
						child.kind = TypeAliasDeclaration;
						thisNode = child;
					}
				}
			});
		case ClassDeclaration:
		case ClassExpression:
		case ArrowFunction:
			let gt :boolean = false;
			forEachChild(node, function (child :Node) {
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
			forEachChild(node, function (child :Node) {
				if ( ts_index===child.pos ) { es.push(from(child)); }
				else if ( afterColon(child) ) { es.push(ts.slice(ts_index, child.pos-1)+remove(ts.slice(child.pos-1, child.end))); }
				else { es.push(ts.slice(ts_index, child.pos)+from(child)); }
				ts_index = child.end;
			});
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
		case Parameter:
			forEachChild(node, function (child :Node) {
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
			forEachChild(node, function (child :Node) {
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
			forEachChild(node, function (child :Node) {
				if ( ts_index!==child.pos ) { es.push(ts.slice(ts_index, child.pos)); }
				es.push(from(child));
				ts_index = child.end;
			});
			if ( ts_index!==node.end ) { es.push(ts.slice(ts_index, node.end)); }
			break;
	}
	return es.join('');
}

type Node = { kind :number, pos :number, end :number };
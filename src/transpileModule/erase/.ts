import * as deps from '../../deps';
import * as ing from '../ing';
import * as util from '../util';
import * as TSX from '../TSX/';

import eraseInsertableType from './InsertableType';
import eraseArgumentType from './ArgumentType';
import eraseFunctionType from './FunctionType';
import eraseClassType from './ClassType';
import eraseFieldType from './FieldType';
import eraseVariableType from './VariableType';

export default util.set_erase(erase);
function * erase (this :void, node :util.Node) :Generator<string, void, void> {
	switch ( node.kind ) {
		//case NamespaceExportDeclaration:
		case deps.TypeAliasDeclaration:
		case deps.InterfaceDeclaration:
		//case deps.ProtectedKeyword:
		//case deps.ReadonlyKeyword:
		//case deps.PrivateKeyword:
		//case deps.PublicKeyword:
		//case deps.IndexSignature:
		//case deps.AbstractKeyword:
		case deps.ExclamationToken:///
		//case deps.OverrideKeyword:
			return yield util.eraseRange(node);
		case deps.EnumDeclaration:
			const { name } = node as deps.EnumDeclaration;
			throw util.throwPosError(name ? name.pos - 4 : util.RealPos(node), `"enum" is not supported while transpileModule`);
		case deps.ImportEqualsDeclaration:
			const { moduleReference } = node as deps.ImportEqualsDeclaration;
			throw util.throwPosError(moduleReference ? moduleReference.pos - 1 : util.RealPos(node), `@ltd/j-ts does not support "import="`);
		case deps.ImportDeclaration:
			if ( ( node as deps.ImportDeclaration ).importClause?.isTypeOnly ) { return yield util.eraseRange(node); }
			break;
		case deps.ExportDeclaration:
			if ( ( node as deps.ExportDeclaration ).isTypeOnly ) { return yield util.eraseRange(node); }
			break;
		case deps.ExportAssignment:
			if ( ( node as deps.ExportAssignment ).isExportEquals ) {
				const { expression } = node as deps.ExportAssignment;
				util.throwPosError(expression ? expression.pos - 1 : util.RealPos(node), `@ltd/j-ts does not support "export="`);
			}
			break;
		case deps.Parameter:
			( node as deps.ParameterDeclaration ).modifiers && util.throwPosError(util.RealPos(( node as deps.ParameterDeclaration ).name ?? node), `@ltd/j-ts does not support parameter property (readonly / public / protected / private / override)`);
			break;
	}
	if ( node.modifiers ) { for ( const modifier of node.modifiers ) { if ( modifier.kind===deps.DeclareKeyword ) { return yield util.eraseRange(node); } } }
	node.decorators && util.throwPosError(util.RealPos(node.decorators), `@ltd/j-ts can not handle decorator`);
	switch ( node.kind ) {
		case deps.ModuleDeclaration:
			const { name } = node as deps.ModuleDeclaration;
			throw name
				? ing.ts.endsWith('module', name.pos)
					? util.throwPosError(name.pos - 6, `@ltd/j-ts does not support "module" (before ECMAScript proposal finished)`)
					: util.throwPosError(name.pos - 9, `@ltd/j-ts does not support "namespace"`)
				: util.throwPosError(util.RealPos(node), `@ltd/j-ts does not support "module" (before ECMAScript proposal finished) and "namespace"`);
		case deps.CallExpression:
		case deps.NewExpression:
		case deps.TaggedTemplateExpression:
			return yield * eraseArgumentType(node);
		case deps.VariableDeclaration:
			return yield * eraseVariableType(node as deps.VariableDeclaration);
		case deps.PropertyDeclaration:
			return yield * eraseFieldType(node as deps.PropertyDeclaration);
		case deps.ArrowFunction:
			return yield * eraseFunctionType(node as deps.ArrowFunction);
		case deps.MethodDeclaration:
		case deps.FunctionDeclaration:
			return ( node as deps.MethodDeclaration | deps.FunctionDeclaration ).body
				? yield * eraseFunctionType(node as deps.MethodDeclaration | deps.FunctionDeclaration)
				: yield util.eraseRange(node);
		case deps.FunctionExpression:
			return yield * eraseFunctionType(node as deps.FunctionExpression);
		case deps.GetAccessor:
		case deps.SetAccessor:
		case deps.Constructor:
			return ( node as deps.GetAccessorDeclaration | deps.SetAccessorDeclaration | deps.ConstructorDeclaration ).body
				? yield * eraseFunctionType(node as deps.GetAccessorDeclaration | deps.SetAccessorDeclaration | deps.ConstructorDeclaration)
				: yield util.eraseRange(node);
		case deps.ClassDeclaration:
		case deps.ClassExpression:
			return yield * eraseClassType(node as deps.ClassDeclaration | deps.ClassExpression);
		case deps.Parameter: {
			const { dotDotDotToken, name, questionToken, type, initializer } = node as deps.ParameterDeclaration;
			let ts_index = node.pos;
			if ( dotDotDotToken ) {
				if ( ts_index!==dotDotDotToken.pos ) { yield util.slice(ts_index, dotDotDotToken.pos); }
				yield * util.erase(dotDotDotToken);
				ts_index = dotDotDotToken.end;
			}
			{
				if ( ts_index!==name.pos ) { yield util.slice(ts_index, name.pos); }
				yield * util.erase(name);
				ts_index = name.end;
			}
			if ( questionToken ) { yield util.slice(ts_index, ( ts_index = questionToken.end ) - 1) + ' '; }
			if ( type ) { yield util.slice(ts_index, type.pos - 1) + util.eraseBetween(type.pos - 1, ts_index = type.end); }
			if ( initializer ) {
				if ( ts_index!==initializer.pos ) { yield util.slice(ts_index, initializer.pos); }
				yield * util.erase(initializer);
				ts_index = initializer.end;
			}
			if ( ts_index!==node.end ) { yield util.slice(ts_index, node.end); }
			return;
		}
		case deps.NonNullExpression: {
			const { expression } = node as deps.NonNullExpression;
			if ( node.pos!==expression.pos ) { yield util.slice(node.pos, expression.pos); }
			yield * util.erase(expression);
			yield util.slice(expression.end, node.end - 1) + ' ';
			return;
		}
		case deps.AsExpression: {
			const { expression, type } = node as deps.AsExpression;
			yield * util.erase(expression);
			yield util.slice(expression.end, type.pos - 2) + util.eraseBetween(type.pos - 2, type.end);
			return;
		}
	}
	if ( TSX.ing ) {
		const generator = TSX.handle(node);
		if ( generator ) { return yield * generator; }
	}
	else {
		switch ( node.kind ) {
			case deps.ReturnStatement:
				return ( node as deps.ReturnStatement ).expression
					? yield * eraseInsertableType(node as deps.ReturnStatement)
					: yield util.codeOf(node);
			case deps.ThrowStatement:
				return yield * eraseInsertableType(node as deps.ThrowStatement);
			case deps.YieldExpression:
				if ( ( node as deps.YieldExpression ).expression ) {
					if ( ( node as deps.YieldExpression ).asteriskToken ) {
						const { expression } = node as deps.YieldExpression;
						yield util.slice(node.pos, expression!.pos);
						yield * util.erase(expression!);
						if ( expression!.end!==node.end ) { yield util.slice(expression!.end, node.end); }
					}
					else { yield * eraseInsertableType(node as deps.YieldExpression); }
				}
				else { yield util.codeOf(node); }
				return;
			case deps.TypeAssertionExpression: {
				const { type, expression } = node as deps.TypeAssertion;
				yield util.slice(node.pos, type.pos - 1) + util.eraseBetween(type.pos - 1, type.end) + util.slice(type.end, expression.pos - 1) + ' ';
				yield * util.erase(expression);
				return;
			}
		}
	}
	let ts_index = node.pos;
	const childNodes = util.ChildNodes(node);
	if ( childNodes ) {
		for ( const child of childNodes ) {
			if ( ts_index!==child.pos ) { yield util.slice(ts_index, child.pos); }
			yield * util.erase(child);
			ts_index = child.end;
		}
	}
	if ( ts_index!==node.end ) { yield util.slice(ts_index, node.end); }
}

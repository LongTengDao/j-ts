import * as deps from '../../deps';
import * as util from '../util';

export default function * (this :void, {
	pos: ts_index, end,
	modifiers,                name,                                  typeParameters,
	heritageClauses, members,
} :
	| deps.ClassDeclaration
	| deps.ClassExpression
) :Generator<string, void, void> {
	
	if ( modifiers ) {
		for ( const modifier of modifiers ) {
			if ( ts_index!==modifier.pos ) { yield util.slice(ts_index, modifier.pos); }
			switch ( modifier.kind ) {
				case deps.AbstractKeyword:
					yield util.eraseRange(modifier);
					break;
				case deps.ExportKeyword:///
				case deps.DefaultKeyword:///
				case deps.ConstKeyword:///
					yield util.codeOf(modifier);
					break;
				default:
					throw util.throwPosError(util.RealPos(modifier), `@ltd/j-ts does not know class modifier ${deps.SyntaxKind[modifier.kind]}`);
			}
			ts_index = modifier.end;
		}
	}
	
	if ( name ) {
		if ( ts_index!==name.pos ) { yield util.slice(ts_index, name.pos); }
		yield * util.erase(name);
		ts_index = name.end;
	}
	
	let gt = false;
	
	if ( typeParameters ) {
		for ( const typeParameter of typeParameters ) {
			if ( gt ) { yield util.eraseBetween(ts_index, typeParameter.end); }
			else {
				yield util.slice(ts_index, typeParameter.pos - 1) + util.eraseBetween(typeParameter.pos - 1, typeParameter.end);
				gt = true;
			}
			ts_index = typeParameter.end;
		}
	}
	
	if ( heritageClauses ) {
		for ( const { pos, token, types, end } of heritageClauses ) {
			if ( gt ) {
				gt = false;
				yield util.eraseFirstGT(util.slice(ts_index, pos));
			}
			else if ( ts_index!==pos ) { yield util.slice(ts_index, pos); }
			if ( token===deps.ExtendsKeyword ) {
				types.length===1 || util.throwPosError(types[1]!.pos, `"extends" should not have ${types.length} child`);
				const { expression } = types[0]!;
				yield util.slice(pos, expression.pos);
				yield * util.erase(expression);
				yield util.eraseBetween(expression.end, end);
			}
			else if ( token===deps.ImplementsKeyword ) {
				const realPos = types[0]!.pos - 10;
				yield util.slice(pos, realPos) + util.eraseBetween(realPos, end);
			}
			else { util.throwPosError(pos, `@ltd/j-ts does not know HeritageClause which token is ${deps.SyntaxKind[token]}`); }
			ts_index = end;
		}
	}
	
	for ( const member of members ) {
		if ( gt ) {
			gt = false;
			yield util.eraseFirstGT(util.slice(ts_index, member.pos));
		}
		else if ( ts_index!==member.pos ) { yield util.slice(ts_index, member.pos); }
		member.kind===deps.IndexSignature
			? yield util.eraseRange(member)
			: yield * util.erase(member);
		// PropertyDeclaration
		// SemicolonClassElement
		// MethodDeclaration
		// ConstructorDeclaration
		// GetAccessorDeclaration
		// SetAccessorDeclaration
		// ClassStaticBlockDeclaration
		ts_index = member.end;
	}
	
	if ( ts_index!==end ) {
		yield gt
			? util.eraseFirstGT(util.slice(ts_index, end))
			: util.slice(ts_index, end);
	}
	
}

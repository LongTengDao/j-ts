export const {
	transpileModule: TypeScript_transpileModule,
	createSourceFile,
	forEachChild,
	JsxEmit: { None, Preserve, React, ReactNative, ReactJSX, ReactJSXDev },
	ScriptTarget: { ESNext },
	ScriptKind: { TS, TSX },
	SyntaxKind,
} :typeof import('typescript') = require('typescript');

export const {
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
	InterfaceDeclaration,
	EnumDeclaration,
	DeclareKeyword,
	Block,
	//EndOfFileToken,
	NonNullExpression,
	ModuleDeclaration,
	ReadonlyKeyword,
	PrivateKeyword,
	ProtectedKeyword,
	PublicKeyword,
	ExportAssignment,
	ImportEqualsDeclaration,
	ReturnStatement,
	ThrowStatement,
	YieldExpression,
	IndexSignature,
	AbstractKeyword,
	//NamespaceExportDeclaration,
	ExportDeclaration,
	ImportDeclaration,
	ImportClause,
	Constructor,
	ExclamationToken,
	ExpressionWithTypeArguments,
	TaggedTemplateExpression,
	OverrideKeyword,
	EqualsGreaterThanToken,
	JsxElement,
	JsxSelfClosingElement,
	JsxOpeningElement,
	JsxClosingElement,
	JsxFragment,
	JsxOpeningFragment,
	JsxClosingFragment,
	JsxAttribute,
	JsxAttributes,
	JsxSpreadAttribute,
	JsxExpression,
	JsxText,
	//JsxTextAllWhiteSpaces,
	BinaryExpression,
	CommaToken,
	Identifier,
	ObjectLiteralExpression,
	ShorthandPropertyAssignment,
	SpreadAssignment,
	PropertyAssignment,
	ComputedPropertyName,
	StringLiteral,
	ImplementsKeyword,
	ExtendsKeyword,
	StaticKeyword,
	AsyncKeyword,
	ExportKeyword,
	ConstKeyword,///
	DefaultKeyword,///
	NamedImports,
	NamedExports,
} = SyntaxKind;

export type ReadonlyTextRange = ts.ReadonlyTextRange;
export type DecoratorsArray = ts.Node['decorators'];
export type ModifiersArray = ts.Node['modifiers'];

export type JsxElement = ts.JsxElement;
export type JsxSelfClosingElement = ts.JsxSelfClosingElement;
export type JsxFragment = ts.JsxFragment;
export type JsxOpeningElement = ts.JsxOpeningElement;
export type JsxClosingElement = ts.JsxClosingElement;
export type JsxOpeningFragment = ts.JsxOpeningFragment;
export type JsxClosingFragment = ts.JsxClosingFragment;
export type JsxAttributes = ts.JsxAttributes;
export type JsxAttribute = ts.JsxAttribute;
export type JsxSpreadAttribute = ts.JsxSpreadAttribute;
export type JsxExpression = ts.JsxExpression;
export type Expression = ts.Expression;
export type BinaryExpression = ts.BinaryExpression;
export type StringLiteral = ts.StringLiteral;
export type ParameterDeclaration = ts.ParameterDeclaration;
export type Identifier = ts.Identifier;
export type ImportDeclaration = ts.ImportDeclaration;
export type ImportClause = ts.ImportClause;
export type TypeAssertion = ts.TypeAssertion;
export type ObjectLiteralExpression = ts.ObjectLiteralExpression;
export type GetAccessorDeclaration = ts.GetAccessorDeclaration;
export type SetAccessorDeclaration = ts.SetAccessorDeclaration;
export type ConstructorDeclaration = ts.ConstructorDeclaration;
export type MethodDeclaration = ts.MethodDeclaration;
export type FunctionDeclaration = ts.FunctionDeclaration;
export type ExportDeclaration = ts.ExportDeclaration;
export type ExportAssignment = ts.ExportAssignment;
export type AsExpression = ts.AsExpression;
export type ExpressionWithTypeArguments = ts.ExpressionWithTypeArguments;
export type ReturnStatement = ts.ReturnStatement;
export type ThrowStatement = ts.ThrowStatement;
export type YieldExpression = ts.YieldExpression;
export type NonNullExpression = ts.NonNullExpression;
export type FunctionExpression = ts.FunctionExpression;
export type ClassDeclaration = ts.ClassDeclaration;
export type ClassExpression = ts.ClassExpression;
export type ArrowFunction = ts.ArrowFunction;
export type PropertyDeclaration = ts.PropertyDeclaration;
export type VariableDeclaration = ts.VariableDeclaration;
export type ModuleDeclaration = ts.ModuleDeclaration;
export type EnumDeclaration = ts.EnumDeclaration;
export type ImportEqualsDeclaration = ts.ImportEqualsDeclaration;
export type NamedImports = ts.NamedImports;
export type NamedExports = ts.NamedExports;

import type * as ts from 'typescript';
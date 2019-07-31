'use strict';

require('../test/test.js')(async ({ build, 龙腾道, get }) => {
	await build({
		name: 'j-ts',
		user: 'LongTengDao@ltd',
		Auth: 龙腾道,
		Copy: 'LGPL-3.0',
		NPM: {
			description:
				'TypeScript-ECMAScript transpiler with pretty source mapping while not using sourceMap. Belong to "Plan J".／'+
				'不借助 sourceMap 实现源码位置映射的 TypeScript-ECMAScript 转译工具。从属于“简计划”。',
			dependencies: {
				'typescript': '3.5.2',
			},
		},
		ES: 6,
		semver: await get('src/version'),
		LICENSE_: true,
	});
});

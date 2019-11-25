const Parser = require('typescript-parser');

async function test() {
	const parser = new Parser.TypescriptParser();
	const test = await parser.parseFile('test.ts', 'workspace root');
	console.log(test);
	//console.log(test.declarations[0].methods);
	//console.log(test.declarations[0] instanceof Parser.ClassDeclaration)
	test.declarations.forEach((declaration) => {
		if (declaration instanceof Parser.ClassDeclaration) {
			console.log(declaration.name, declaration.properties);
		}
	})
}

test();
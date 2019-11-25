const fs = require('fs');
const parser = require("@typescript-eslint/typescript-estree");
var walk = require( 'estree-walker' ).walk;

const astNodeTypes = parser.AST_NODE_TYPES;

const options = {
  comment: false,
  jsx: false
}

const source = fs.readFileSync('./test.ts', 'utf8');
const program = parser.parse(source, options)
console.log(program);


const parseClass = (node) => {
  // When a class is declared, store it in a table, along with file?? (TODO how to deal with files that export other files??)
// When a "TSTypeAnnotation" is found, add it to a queue of possible links to be checked afterwards against the table?

// "Identifier" for name/id
// "superClass" identifier for dependency name/id
// "TSTypeAnnotation" identifier for dependency name/id - Under "ClassProperty", or in "MethodDefinition"/"FunctionExpression"/"BlockStatement"/...

// Track "ClassProperty" names,
// And track use of "MemberExpression" in "FunctionExpression"/.... for cohesion calculation
// (Return list of class properties, list of functions, and list of member variables used in each function?)
// TODO: how should this deal with superclass variables?

console.log(JSON.stringify(node));
console.log();
console.log();
console.log();
}


const parseImport = (node) => {
  // for actual dependencies, keep track of import files
  console.log(JSON.stringify(node));
  console.log();
  console.log();
  console.log();
}

let first = true;
walk(program, {
  enter(node, parent, prop, index) {
    if (first) {
      fs.writeFileSync('test.json', JSON.stringify(node));
      first = false;
    }
     switch (node.type) {
       case astNodeTypes.ImportDeclaration:
         parseImport(node);
        this.skip();
       case astNodeTypes.ClassDeclaration:
         parseClass(node);
         this.skip();
       default:
         console.log(node.type);
    }
  } 
})
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

walk(program, {
  enter(node, parent, prop, index) {
    // switch (node.type) {
    //   case astNodeTypes.ClassDeclaration:
    //     console.log(node);
    //     break;
    //   default:
    //     console.log(node.type);
    // }
    console.log(node);
  } 
})
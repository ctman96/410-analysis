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
  console.log(JSON.stringify(node));
  console.log();
  console.log();
  console.log();
}

const parseImport = (node) => {
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
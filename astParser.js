const fs = require('fs');
const parser = require("@typescript-eslint/typescript-estree");
var walk = require( 'estree-walker' ).walk;

const astNodeTypes = parser.AST_NODE_TYPES;

const options = {
  comment: false,
  jsx: false
}


const parseClass = (classDeclaration) => {
  // When a class is declared, store it in a table, along with file?? (TODO how to deal with files that export other files??)
// When a "TSTypeAnnotation" is found, add it to a queue of possible links to be checked afterwards against the table?

// "Identifier" for name/id
// "superClass" identifier for dependency name/id
// "TSTypeAnnotation"/"TSTypeReference" identifier for dependency name/id - Under "ClassProperty", or in "MethodDefinition"/"FunctionExpression"/"BlockStatement"/...

// Track "ClassProperty" names,
// And track use of "MemberExpression" in "FunctionExpression"/.... for cohesion calculation
// (Return list of class properties, list of functions, and list of member variables used in each function?)
// TODO: how should this deal with superclass variables?
  const classobj = {
    id: classDeclaration.id.name,
    variables: [],
    functions: [],
  }

  // Don't know they're for sure links, in case they're node_module dependencies
  const possibleLinks = {
    files: [], // TODO from imports;
    ids: [],
  }

  // Superclass dependency for sure
  if (classDeclaration.superClass && classDeclaration.superClass.type === astNodeTypes.Identifier) {
    possibleLinks.ids.push(classDeclaration.superClass.name);
  }
  if (classDeclaration.implements && classDeclaration.implements.length) {
    classDeclaration.implements.forEach((implements) => {
      if (implements.type == astNodeTypes.TSClassImplements 
        && implements.expression && implements.expression.type == astNodeTypes.Identifier) {
        possibleLinks.ids.push(implements.expression.name);
      }
    })
  }

  if (classDeclaration.body && classDeclaration.body.type == astNodeTypes.ClassBody) {
    walk(classDeclaration.body, {
      enter(node, parent, prop, index) {
        switch (node.type) {
          case astNodeTypes.ClassBody:
            break;
          case astNodeTypes.ClassProperty:
            // TODO: track all member variables, and look for any dependencies with TSTypeAnnotation/TSTypeReference.typeName.name
            // TODO: Do we actually care about those kinds of links, or do we just want inheritance links?
            this.skip();
            break;
          case astNodeTypes.MethodDefinition:
            // TODO: Find any MemberExpression identifiers and track them for cohesion
            // Possible TODO: Find any class usages for dependencies, but doesn't look simple so maybe leave it.
            this.skip();
            break;
          default:
            console.log(node.type);
        }
      } 
    })
  }

  return {
    class: classobj,
    possibleLinks,
  }
}


const parseImport = (node) => {
  // for actual dependencies, keep track of import files
  // look closer at what specifically is imported from each file?
  console.log(JSON.stringify(node));
  console.log();
  console.log();
  console.log();
}



const parse = (filepath) => {
  const source = fs.readFileSync(filepath, 'utf8');
  const program = parser.parse(source, options)
  console.log(program);

  let first = true;
  walk(program, {
    enter(node, parent, prop, index) {
      if (first) {
        fs.writeFileSync('test.json', JSON.stringify(node));
        first = false;
      }
      switch (node.type) {
        case astNodeTypes.ImportDeclaration:
          const parsedImport = parseImport(node);
          this.skip();
          break;
        case astNodeTypes.ClassDeclaration:
          const parsedClass = parseClass(node);
          console.log(parsedClass);
          this.skip();
          break;
        default:
          console.log(node.type);
      }
    } 
  })
}

parse('./test.ts');
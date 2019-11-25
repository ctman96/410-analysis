const fs = require('fs');
const parser = require("@typescript-eslint/typescript-estree");
var walk = require( 'estree-walker' ).walk;

const log = false;

const astNodeTypes = parser.AST_NODE_TYPES;

const options = {
  comment: false,
  jsx: false
}

const parseMethodDefinition = (className, methodDefinition) => {
  let name = "DEFAULT";
  if (methodDefinition.key && methodDefinition.key.type === astNodeTypes.Identifier && methodDefinition.key.name) {
    name = methodDefinition.key.name;
  }
  const parsedMethod = {
    name,
    kind: methodDefinition.kind,
    variables: []
  }

  // TODO: Should constructors be ignored? Or leave that up to matteo?
  
  walk(methodDefinition.value, {
    enter(node, parent, prop, index) {
      switch (node.type) {
        case astNodeTypes.MemberExpression:
          if (node.object) {
            switch (node.object.type) {
              case(astNodeTypes.ThisExpression):
                if (node.property && node.property.type === astNodeTypes.Identifier) {
                    parsedMethod.variables.push(node.property.name);
                }
                break;
              case(astNodeTypes.Identifier):
                if (node.object.name === className) {
                  parsedMethod.variables.push(node.property.name);
                }
                break;
              default:
                //console.log("unparsedMemberExpression", node.object.type);
            }
          }
          this.skip();
          break;
        default:
          // console.log(node.type);
      }
    } 
  })
  return parsedMethod;
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

  const links = []

  // Superclass dependency
  if (classDeclaration.superClass && classDeclaration.superClass.type) {
    switch (classDeclaration.superClass.type) {
      case astNodeTypes.Identifier:
          links.push(classDeclaration.superClass.name);
          break;
      case astNodeTypes.MemberExpression:
        links.push(classDeclaration.superClass.property.name);
        break;
      default:
        if (log) {
          console.log("Unparsed Superclass: ", classDeclaration.superClass.type)
        console.log(classDeclaration.superClass);
        }
        
        break;
    }
  }

  // Interface implementation
  if (classDeclaration.implements && classDeclaration.implements.length) {
    classDeclaration.implements.forEach((implements) => {
      if (implements.type == astNodeTypes.TSClassImplements 
        && implements.expression && implements.expression.type == astNodeTypes.Identifier) {
        links.push(implements.expression.name);
      }
    })
  }

  // Class body
  if (classDeclaration.body && classDeclaration.body.type == astNodeTypes.ClassBody) {
    walk(classDeclaration.body, {
      enter(node, parent, prop, index) {
        switch (node.type) {
          case astNodeTypes.ClassBody:
            break;
          case astNodeTypes.ClassProperty:
            // Add all parsed variables to class variables list
            if (node.key && node.key.type === astNodeTypes.Identifier && node.key.name) {
              classobj.variables.push(node.key.name);
            }
            // TODO: look for any dependencies with TSTypeAnnotation/TSTypeReference.typeName.name
            // TODO: Do we actually care about those kinds of links, or do we just want inheritance links?
            this.skip();
            break;
          case astNodeTypes.MethodDefinition:
            // Find any MemberExpression identifiers and track them for cohesion
            const parsedMethod = parseMethodDefinition(classobj.id, node);
            if (parsedMethod) {
              classobj.functions.push(parsedMethod);
            }
            // Possible TODO: Find any class usages for dependencies, but doesn't look simple so maybe leave it.
            this.skip();
            break;
          default:
              if (log) console.log("Unparsed ClassBody ", node.type);
        }
      } 
    })
  }

  return {
    class: classobj,
    links,
  }
}


const parseImport = (node) => {
  // for actual dependencies, keep track of import files
  // look closer at what specifically is imported from each file?
  // Alternative: Just ignore and add all links, but then remove any links which we're missing classes for?
  const parsedImport = {};
  if (node.source && node.source.type === astNodeTypes.Literal && node.source.value) {
    // TODO: path vs module
    parsedImport.path = node.source.value;
  }

  if (node.specifiers && node.specifiers.length) {
    node.specifiers.forEach((specifier) => {
      if (specifier.type === astNodeTypes.ImportSpecifier) {

      }
    });
  }
  return parsedImport;
}



const parse = (filepath) => {
  if (log) console.log(`Parsing ${filepath}`)
  const source = fs.readFileSync(filepath, 'utf8');
  const program = parser.parse(source, options)
  // console.log(program);

  const parsed = [];

  let first = true;
  walk(program, {
    enter(node, parent, prop, index) {
      if (first) {
        fs.writeFileSync('test.json', JSON.stringify(node));
        first = false;
      }
      switch (node.type) {
        case astNodeTypes.ImportDeclaration:
          //const parsedImport = parseImport(node);
          //imports.push(parsedImport);
          this.skip();
          break;
        case astNodeTypes.ClassDeclaration:
          const parsedClass = parseClass(node);
          if (parsedClass) {
            parsed.push(parsedClass);
          }
          if (log) console.log(parsedClass);
          this.skip();
          break;
        default:
          // console.log(node.type);
      }
    } 
  })
  return parsed;
}


if (require.main === module) {
  log = true;
  //called directly
  const testres = JSON.stringify(parse('./test.ts'));
  console.log(testres);
} else {
  //required as a module
}

module.exports = {
  parse,
}
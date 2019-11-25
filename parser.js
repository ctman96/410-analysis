const Parser = require('typescript-parser');
var data = require('./testAstData.json');

var res = parse(data);

console.log("END");
console.log("LINKS");
console.log(res.links);
console.log("NODES");
console.log(res.nodes);



function parse(fileAst) {

    let res = {nodes: [], links: []};

    // add nodes
    fileAst.declarations.forEach(dec => { 
        // Replace this hasOwnProperty with an instanceOf
        // if (dec instanceof Parser.ClassDeclaration) {
        if (dec.hasOwnProperty('ctor')) {
        let nodeObj = {};
        nodeObj.id = dec.name;

        // Get total number of function variable uses
        
        


        // temporary value
        let functionVarCount = 1;

        // Get total number of class vars
        let numclassVars = Object.keys(dec.properties).length;
        let numMethods = Object.keys(dec.methods).length;

        // console.log("NUMBER OF METHODS");
        // console.log(numMethods);
        // console.log("NUMBER OF CLASS VARS");
        // console.log(numclassVars);

        let totalClassVarCount = numMethods * numclassVars;
        // console.log("totalClassVarCount");
        // console.log(totalClassVarCount);


        let cohesionVal = functionVarCount / totalClassVarCount;
        cohesionVal = Math.round(cohesionVal * 100) / 100;     

        nodeObj.cohesion = cohesionVal;

        res.nodes.push(nodeObj);

        }
    });

    // add links
    fileAst.imports.forEach(imp => {
        fileAst.declarations.forEach(dec => {    
            // Replace this hasOwnProperty with an instanceOf
            if (dec.hasOwnProperty('ctor')) {
                let importObj = {};
                importObj.source = imp.specifiers[0].specifier;
                importObj.target = dec.name;
                res.links.push(importObj)
            }
        });
    });

    return res;
}
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

    // do pre-calc here


    var nodesArr = [];
    
    fileAst.declarations.forEach(dec => {    
        if (dec.hasOwnProperty('ctor')) {
        // is class, so calculate cohesion for this. Might require you to do some counting beforehand

        let cVal;
        let nodeObj = {};
        nodeObj.id = dec.name;

        // GET TOTAL FUNCTION VARIABLE COUNT
        // for each add number of  function vars in class
        
        // let totalClassVarCount;
        // let totalFuncVarCount;

        // totalClassVarCount = Object.keys(dec.properties).length;

        // dec.methods.forEach(m => {
        //     m.variables.forEach(v => {
        //         totalFuncVarCount++;
        //     });
        // });

        // totalFuncVarCount = totalFuncVarCount + totalClassVarCount;

        // GET TOTAL CLASS VARIABLE COUNT
        // for each var in class, count

        let classVars;
        let methodVars;

        classVars = Object.keys(dec.properties).length;

        dec.methods.forEach(m => {
            m.variables.forEach(v => {
                classVars++;
            });
        });

        console.log("classVars");
        console.log(classVars);

        
        if (Object.keys(dec.methods).length == 0) {
            methodVars = 0;
        } else {
            dec.methods.forEach(m => {
                methodVars++;
            });
        }

        methodVars = 1;


        console.log("methodVars");
        console.log(methodVars);



        let totalClassVarCount = methodVars * classVars;

        console.log("totalClassVarCount");
        console.log(totalClassVarCount);
        

        // ROUND TO PERCENTAGE POINT


        
        // nodeObj.cohesion = cVal;
        nodeObj.cohesion = totalClassVarCount;

        nodesArr.push(nodeObj);

        }
    });

    res.nodes = nodesArr;


    // console.log(fileAst.imports);

    var linksArr = [];

    fileAst.imports.forEach(imp => {
        fileAst.declarations.forEach(dec => {    
            if (dec.hasOwnProperty('ctor')) {
                let importObj = {};
                importObj.source = imp.specifiers[0].specifier;
                importObj.target = dec.name;
                linksArr.push(importObj)
            }
        });
    });

    res.links = linksArr;

    return res;
}
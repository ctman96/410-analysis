const Parser = require('./astParser');

if (require.main === module) {
    //called directly
    var res = parse('./test.ts');

    console.log("END");
    console.log(res);

  } else {
    //required as a module
  }


function parse(filepath) {

    let res = {nodes: [], links: []};

    const parsedFile = Parser.parse(filepath);
    parsedFile.forEach((parsedClass) => {

        classData = parsedClass.class;
        //console.log(JSON.stringify(parsedClass))

        const node = {
            id: parsedClass.class.id,
            cohesion: 0 // TODO
        }

        let functionVarCount = 0;

        // number of class variable function usages
        classData.functions.forEach( func => {
            functionVarCount += func.variables.length;
        });

        // number of possible class var usages
        let numclassVars = classData.variables.length;
        let numMethods = classData.functions.length;
        let totalClassVarCount = numMethods * numclassVars;

        let cohesionVal;
        if (totalClassVarCount == 0) {
            cohesionVal = 1
        } else {
            cohesionVal = functionVarCount / totalClassVarCount;
            cohesionVal = Math.round(cohesionVal * 100) / 100;   
        }  

        node.cohesion = cohesionVal;
        res.nodes.push(node);

        // console.log(node)

        parsedClass.links.forEach((target) => {
            const link = {
                source: node.id,
                target,
            }
            res.links.push(link);
        })
    })

    return res;
}


module.exports = {
    parse,
}
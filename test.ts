import { StringValidator } from "./StringValidator";
import { ZipCodeValidator } from "./ZipCodeValidator";
import { OtherClassTest } from "./ZipCodeValidator";
import { exportedVar } from "./ZipCodeValidator";
import strv = require("./StringValidator");
import * as zip from "./ZipCodeValidator";
import {StringValidator as strvalidatoAlt} from "./StringValidator";

class Greeter {
    greeting: string;
    test1: number;
    test2: number;
    swordfish: string;
    constructor(message: string) {
        this.greeting = message;
        this.swordfish = "SWORDFISH";
    }
    greet() {
        return "Hello, " + this.greeting;
    }

    greet2(exportedVar) {
        return "Hello, " + this.greeting + exportedVar + this.swordfish;
    }

    testToSeeIfCounted(){
        var testVar;
        this.test1 = 1;
    }
}

// should have 100% cohesion
class Greeter2 {
    greeting: string;
    test1: number;
    test2: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting + this.test2 + this.test1;
    }
}

class Greeter3 {
    public greeting: string;

    private test1: number;
    test2: number;
    test3: number;
    test4: number;
    test5: number;
    test6: number;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}


class Asdf {
    test: string;
    constructor(message: string) {
        this.test = message;
    }
    greet() {
        return "Hello, " + this.test;
    }
}

// Test implementation / import usage
class validator implements StringValidator {
    isAcceptable(s: string) {
        return false;
    };
}

class Test extends Asdf {
    validator: validator;
    constructor(message: string) {
        super(message);
        this.test += message;
        var tst = new Greeter3("test");
    }
}

class Test2 extends zip.ZipCodeValidator {

}

let greeter = new Greeter("world");

var outerTest;
var outerTest2 = 1;






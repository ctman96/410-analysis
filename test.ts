import { StringValidator } from "./StringValidator";
import { ZipCodeValidator } from "./ZipCodeValidator";
import { OtherClassTest } from "./ZipCodeValidator";
import { exportedVar } from "./ZipCodeValidator";

class Greeter {
    greeting: string;
    test1: number;
    test2: number;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }

    greet2(exportedVar) {
        return "Hello, " + this.greeting + exportedVar;
    }

    test(){
        var testVar;
    }
}

class Greeter2 {
    greeting: string;
    test1: number;
    test2: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

class Greeter3 {
    greeting: string;

    test1: number;
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

class Test extends Asdf {
    constructor(message: string) {
        super(message);
        this.test += message;
    }
}

let greeter = new Greeter("world");

var outerTest;
var outerTest2 = 1;






class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

class Asdf {
    msg: string;
    greeter: Greeter;
}

class Test extends Asdf {
    
}

let greeter = new Greeter("world");
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
import { StringValidator } from "./StringValidator";
export const numberRegexp = /^[0-9]+$/;


class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };


class OtherClassTest {
    foo: number = 42;


    add(x: number, y: number): number {
        return x + y;
    }

    addtest(x: number, y: number): number {
        return x + y;
    }
}

var exportedVar: number = 2;


export { OtherClassTest };
export { exportedVar };

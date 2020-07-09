export function pipe<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(value: T, f1: (v: T) => R1, f2: (v: T) => R2, f3: (v: T) => R3, f4: (v: T) => R4, f5: (v: T) => R5, f6: (v: T) => R6, f7: (v: T) => R7, f8: (v: T) => R8, f9: (v: T) => R9, f10: (v: T) => R10): R10;
export function pipe<T, R1, R2, R3, R4, R5, R6, R7, R8, R9>(value: T, f1: (v: T) => R1, f2: (v: T) => R2, f3: (v: T) => R3, f4: (v: T) => R4, f5: (v: T) => R5, f6: (v: T) => R6, f7: (v: T) => R7, f8: (v: T) => R8, f9: (v: T) => R9): R9;
export function pipe<T, R1, R2, R3, R4, R5, R6, R7, R8>(value: T, f1: (v: T) => R1, f2: (v: T) => R2, f3: (v: T) => R3, f4: (v: T) => R4, f5: (v: T) => R5, f6: (v: T) => R6, f7: (v: T) => R7, f8: (v: T) => R8): R8;
export function pipe<T, R1, R2, R3, R4, R5, R6, R7>(value: T, f1: (v: T) => R1, f2: (v: T) => R2, f3: (v: T) => R3, f4: (v: T) => R4, f5: (v: T) => R5, f6: (v: T) => R6, f7: (v: T) => R7): R7;
export function pipe<T, R1, R2, R3, R4, R5, R6>(value: T, f1: (v: T) => R1, f2: (v: T) => R2, f3: (v: T) => R3, f4: (v: T) => R4, f5: (v: T) => R5, f6: (v: T) => R6): R6;
export function pipe<T, R1, R2, R3, R4, R5>(value: T, f1: (v: T) => R1, f2: (v: T) => R2, f3: (v: T) => R3, f4: (v: T) => R4, f5: (v: T) => R5): R5;
export function pipe<T, R1, R2, R3, R4>(value: T, f1: (v: T) => R1, f2: (v: T) => R2, f3: (v: T) => R3, f4: (v: T) => R4): R4;
export function pipe<T, R1, R2, R3>(value: T, f1: (v: T) => R1, f2: (v: T) => R2, f3: (v: T) => R3): R3;
export function pipe<T, R1, R2>(value: T, f1: (v: T) => R1, f2: (v: T) => R2): R2;
export function pipe<T, R1>(value: T, f1: (v: T) => R1): R1;
export function pipe<T>(value: T): T;
export function pipe<T>(value: T, ...funcs: ((value: any) => unknown)[]): unknown {
  return funcs.reduce(
    (r, f) => f(r),
    value as unknown
  );
}

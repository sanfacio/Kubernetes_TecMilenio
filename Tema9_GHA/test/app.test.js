// test/app.test.js
const { suma } = require('../app');

test('suma 1 + 2 es igual a 3', () => {
    expect(suma(1, 2)).toBe(3);
});

test('suma -1 + 1 es igual a 0', () => {
    expect(suma(-1, 1)).toBe(0);
});

test('Debería devolver 5 cuando se suman 2 y 3', () => {
    expect(suma(2, 3)).toBe(5);
});

test('Debería devolver -1 cuando se suman 2 y -3', () => {
    expect(suma(2, -3)).toBe(-1);
});
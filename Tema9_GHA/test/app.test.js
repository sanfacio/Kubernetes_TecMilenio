// test/app.test.js
const { suma } = require('../app');

test('suma 1 + 2 es igual a 3', () => {
    expect(suma(1, 2)).toBe(3);
});

test('suma -1 + 1 es igual a 0', () => {
    expect(suma(-1, 1)).toBe(0);
});

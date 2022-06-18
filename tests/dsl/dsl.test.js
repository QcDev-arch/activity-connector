/* Function called only once before all the tests in this file */
beforeAll(() => {
    // Use returns if the function your going to call returns a promess
    return true;
});

/* Function called only once after all the tests in this file */
afterAll(() => {
    // Use returns if the function your going to call returns a promess
    return true;
});

/* Function called before each of the tests in this file */
beforeEach(() => {
    true;
});

/* Function called after each of the tests in this file */
afterEach(() => {
    true;
});

/*-------DSL TESTS--------*/

test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
});
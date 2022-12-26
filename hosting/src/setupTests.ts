// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const locationMock: {[key: string]: any} = {
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn()
};
for (const prop in window.location) {
  const v = (<any>window.location)[prop];
  if (locationMock[prop] === undefined) {
    locationMock[prop] = v;
  }
}
Object.defineProperty(window, 'location', {
  value: locationMock
});

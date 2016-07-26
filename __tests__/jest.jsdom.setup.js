jest.mock('react-dom');

jest.mock('../src/utils/getInput', () => {
  return jest.fn(() => ({
    style: {},
    ownerDocument: {
      styleSheets: []
    }
  }));
});

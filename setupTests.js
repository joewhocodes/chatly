import 'jest-localstorage-mock';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  
  // Assign the mock to the global object
  global.localStorage = localStorageMock;
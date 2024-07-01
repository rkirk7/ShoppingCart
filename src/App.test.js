import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import "@testing-library/jest-dom";
import { useDataApi } from './Components/UseDataApi';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

it("successfully fetches and renders", async () => {
  const mock = new MockAdapter(axios);

  const mockResponse = {
    data: {
      products: {
        data: [
          {
            id: 1,
            attributes: {
              name: 'Apples',
              country: 'Italy',
              cost: 12,
              instock: 2,
              cartstock: 0
            }
          }
        ]
      }
    }
  }

  mock.onPost('http://localhost:1337/graphql').reply(200, mockResponse)

  render(<App />);
  
  // Intentionally wait for an element that we know won't appear
  await waitFor(() => {
    const orangeElement = screen.getByText(/Oranges/i); // This should fail because 'Oranges' is not in mockResponse
  });
});

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// Mock API response for demonstration
const mockLoginResponse: LoginResponse = {
  token: 'mock-jwt-token',
  user: {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
  },
};

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock authentication logic
  if (username === 'demo' && password === 'demo123') {
    return mockLoginResponse;
  }

  throw new Error('Invalid credentials');
};
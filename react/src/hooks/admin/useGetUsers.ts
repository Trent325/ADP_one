import { useQuery } from 'react-query';

export const useAllUsers = () => {
  const token = localStorage.getItem('token') || '';

  return useQuery(
    'allUsers',
    async () => {
      const response = await fetch('http://localhost:3000/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    }
    
  );
};

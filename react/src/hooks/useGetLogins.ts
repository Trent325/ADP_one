import { useQuery } from 'react-query';

export const useLoginRecords = () => {
  const token = localStorage.getItem('token') || '';

  return useQuery(
    'loginRecords',
    async () => {
      const response = await fetch('http://localhost:3000/api/auth/logins', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch login records');
      }
      return response.json();
    }
  );
};

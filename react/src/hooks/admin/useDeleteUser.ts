import { useMutation } from 'react-query';

export const useDeleteUser = () => {
  const token = localStorage.getItem('token') || '';

  return useMutation(
    async (userId: string) => {
      const response = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      return response.json();
    }
  );
};

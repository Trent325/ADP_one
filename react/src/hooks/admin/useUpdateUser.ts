import { useMutation } from 'react-query';

export const useUpdateUser = () => {
  const token = localStorage.getItem('token') || '';

  return useMutation(
    async ({ id, updatedUser }: { id: string; updatedUser: { username?: string; password?: string; isAdmin?: boolean } }) => {
      const response = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the header
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      return response.json();
    }
  );
};

import { useMutation, useQueryClient } from 'react-query';

export const useAddUser = () => {
  const token = localStorage.getItem('token') || '';
  const queryClient = useQueryClient();

  return useMutation(
    async (newUser: { username: string; password: string; isAdmin: boolean }) => {
      const response = await fetch('http://localhost:3000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the header
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      return response.json();
    }, {
      onSuccess: ()=> {
        queryClient.invalidateQueries("allUsers")
      },
    }
  );
};

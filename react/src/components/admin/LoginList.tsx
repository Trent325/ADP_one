import React from "react";
import { useLoginRecords } from "../../hooks/useGetLogins";
import { Card, Spinner } from "react-bootstrap";

const LoginRecords: React.FC = () => {
  const { data, error, isLoading } = useLoginRecords();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-4">Error fetching logins</div>;
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <h1 className="text-2xl font-bold mb-4">Login Records</h1>
      <div className="w-full max-w-lg">
        {data.map(
          (
            record: { userId: string; username: string; loginTime: string },
            index: number
          ) => (
            <Card key={index} className="mb-4">
              <Card.Body>
                <Card.Title>Username: {record.username}</Card.Title>
                <Card.Text>
                  <strong>User ID:</strong> {record.userId}
                  <br />
                  <strong>Login Time:</strong>{" "}
                  {new Date(record.loginTime).toLocaleString()}
                </Card.Text>
              </Card.Body>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default LoginRecords;

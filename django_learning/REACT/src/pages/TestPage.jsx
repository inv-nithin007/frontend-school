import { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function TestPage() {
  const [message, setMessage] = useState("");

  const testConnection = async () => {
    try {
      const response = await fetch(`${API}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test',
          password: 'test'
        })
      });
      
      if (response.ok) {
        setMessage("✅ Connection successful!");
      } else {
        setMessage("✅ Connection working (login failed as expected)");
      }
    } catch (error) {
      setMessage(`❌ Connection failed: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} textAlign="center">
        <Typography variant="h4" mb={3}>Connection Test</Typography>
        <Typography variant="body1" mb={3}>
          API URL: {API}
        </Typography>
        <Button 
          variant="contained" 
          onClick={testConnection}
          sx={{ mb: 3 }}
        >
          Test Connection
        </Button>
        {message && (
          <Typography variant="h6" color={message.includes('✅') ? 'success.main' : 'error.main'}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
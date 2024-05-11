import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

function PasswordResetForm({ onPasswordReset }) {
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onPasswordReset(email);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit">Reset Password</Button>
        </form>
    );
}

export default PasswordResetForm;
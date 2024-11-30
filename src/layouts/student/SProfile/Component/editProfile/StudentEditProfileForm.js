import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

function StudentEditProfileForm({ profileInfo, onClose, onSave }){
    const [formData, setFormData] = useState(profileInfo);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Pass updated data back to parent component
    };

    return (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Room No"
            name="roomNo"
            value={formData.roomNo}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Residence"
            name="residence"
            value={formData.residence}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
           <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4} 
          />
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary" style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </form>
      );

}
export default StudentEditProfileForm
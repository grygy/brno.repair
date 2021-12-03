import React from 'react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useHistory } from 'react-router-dom';

const NotFound = () => {
	const history = useHistory();
	return (
		<Box mt={4}>
			<Typography variant="h2" mb={4}>
				Stránka nebyla nalezena
			</Typography>
			<Button
				variant="contained"
				sx={{ mt: 4, mb: 6 }}
				onClick={() => {
					history.push('/');
				}}
			>
				Jít domů
			</Button>
		</Box>
	);
};

export default NotFound;

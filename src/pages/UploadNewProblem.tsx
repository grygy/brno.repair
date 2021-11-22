import React from 'react';
import { Button, Typography } from '@mui/material';
import { Timestamp } from '@firebase/firestore';

import { addProblem } from '../utils/firebase';
import useLoggedInUser from '../hooks/useLoggedInUser';

const UploadNewProblem = () => {
	const user = useLoggedInUser();
	return (
		<Button
			onClick={() => {
				addProblem({
					author: user?.uid ?? '',
					category: 'Doprava',
					created: Timestamp.now(),
					description: 'Sample text',
					location: 'sample location',
					resolved: null,
					title: 'awwwwww problem'
				});
			}}
		>
			Add simple problem
		</Button>
	);
};

export default UploadNewProblem;

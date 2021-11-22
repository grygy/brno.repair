import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import { Problem, getLastProblems } from '../utils/firebase';

const Home = () => {
	const [problems, setProblems] = useState<Problem[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			const res = await getLastProblems(10);
			setProblems(res);
			setLoading(false);
		})();
	}, []);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<>
			{problems.map(problem => (
				<Box key={problem.created.toString()}>
					<Typography>{problem.title}</Typography>
				</Box>
			))}
		</>
	);
};

export default Home;

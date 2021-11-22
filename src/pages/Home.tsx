import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import { Problem, getLastProblems } from '../utils/firebase';
import ProblemPreview from '../components/ProblemPreview';

const Home = () => {
	const [problems, setProblems] = useState<Problem[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			const res = await getLastProblems(3);
			setProblems(res);
			setLoading(false);
		})();
	}, []);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<>
			<Typography mt={2} variant="h4">
				3 najnovsie problemy
			</Typography>
			<Box sx={{ display: 'flex', gap: 2 }}>
				{problems.map(problem => (
					<ProblemPreview key={problem.created.toString()} problem={problem} />
				))}
			</Box>
		</>
	);
};

export default Home;

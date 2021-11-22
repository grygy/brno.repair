import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material';

import { getLastProblems, ProblemWithId } from '../utils/firebase';
import ProblemPreview from '../components/ProblemPreview';

const Home = () => {
	const [problems, setProblems] = useState<ProblemWithId[]>([]);
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
			<Box alignSelf="center">
				<Grid container alignItems="center" direction="row" mt={5}>
					<Grid item>
						<img src="icon.png" style={{ width: '200px' }} alt="hlavna ikona" />
					</Grid>
					<Grid item>
						<Typography variant="h1" fontWeight="bolder">
							Brno. <br />
							Repair
						</Typography>
					</Grid>
				</Grid>
			</Box>

			<Typography mt={5} mb={2} variant="h4" color="#cb0e21">
				TOP 3 problemy
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

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';

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
				Nově přidané problémy
			</Typography>
			<Grid container spacing={2}>
				{problems.map(problem => (
					<Grid
						key={problem.created.toString()}
						item
						xs={12}
						sm={6}
						md={4}
						lg={4}
					>
						<ProblemPreview problem={problem} />
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default Home;

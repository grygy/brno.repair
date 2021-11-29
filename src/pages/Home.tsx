import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	Container,
	Grid,
	Stack,
	Typography
} from '@mui/material';
import { useHistory } from 'react-router-dom';

import { getLastProblems, ProblemWithId } from '../utils/firebase';
import ProblemPreview from '../components/ProblemPreview';

const Home = () => {
	const [problems, setProblems] = useState<ProblemWithId[]>([]);
	const [loading, setLoading] = useState(true);
	const history = useHistory();
	useEffect(() => {
		(async () => {
			const res = await getLastProblems(3);
			setProblems(res);
			setLoading(false);
		})();
	}, []);

	return (
		<>
			{/* Hero unit */}
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 8,
					pb: 6
				}}
			>
				<Container maxWidth="lg">
					<Grid container spacing={2}>
						<Grid item md={8} sm={12}>
							<Typography
								component="h1"
								variant="h1"
								align="left"
								color="text.primary"
								gutterBottom
								sx={{ fontWeight: '700' }}
							>
								Brno.
								<br />
								Repair
							</Typography>
							<Typography
								variant="h5"
								align="left"
								color="text.secondary"
								paragraph
							>
								Našli jste nový problém v Brně, který Vám nedá spát? Chcete s
								tím něco udělat? <br /> Nahlašte tento problém nebo
								nepříjemnost.
							</Typography>
							<Stack
								sx={{ pt: 4 }}
								direction="row"
								spacing={2}
								justifyContent="left"
							>
								<Button
									variant="contained"
									onClick={() => history.push('/upload-new-problem')}
								>
									Přidej nový problém
								</Button>
							</Stack>
						</Grid>
						<Grid
							item
							md={4}
							sm={12}
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<Box sx={{ textAlign: 'center', justifyContent: 'center' }}>
								<img src="/logo512.png" width="300px" alt="logo" />
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>

			<Typography mt={5} mb={2} variant="h4" color="#cb0e21">
				Nově přidané problémy
			</Typography>
			{loading ? (
				<Box
					sx={{
						bgcolor: 'background.paper',
						pt: 8,
						pb: 6,
						textAlign: 'center'
					}}
				>
					<CircularProgress size={100} />
				</Box>
			) : (
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
			)}
		</>
	);
};

export default Home;

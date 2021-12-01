import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { DocumentData, QueryDocumentSnapshot } from '@firebase/firestore';
import { LoadingButton } from '@mui/lab';

import ProblemPreview from '../components/ProblemPreview';
import { ProblemWithId, getProblemsWithPagination } from '../utils/firebase';

const Problems = () => {
	const [loading, setLoading] = useState(true);
	const [problems, setProblems] = useState<ProblemWithId[]>([]);
	const [lastVisible, setLastVisible] = useState<
		QueryDocumentSnapshot<DocumentData> | undefined
	>(undefined);
	const [fetching, setFetching] = useState(false);

	const setData = async () => {
		const [newProblems, last] = await getProblemsWithPagination(lastVisible);
		setProblems([...problems, ...newProblems]);
		setLastVisible(last);
	};

	useEffect(() => {
		(async () => {
			await setData();
			setLoading(false);
		})();
	}, []);

	const fetchMoreProblems = async () => {
		setFetching(true);
		await setData();
		setFetching(false);
	};

	return (
		<Box mt={4}>
			<Typography variant="h2" mb={4}>
				Seznam problémů
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
			<LoadingButton loading={fetching} onClick={fetchMoreProblems}>
				more
			</LoadingButton>
		</Box>
	);
};

export default Problems;

import React, { FC, useState } from 'react';
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { match, RouteComponentProps } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import DoneIcon from '@mui/icons-material/Done';

import useDetail from '../hooks/useDetail';
import useLoggedInUser from '../hooks/useLoggedInUser';
import { resolveProblem } from '../utils/firebase';

const Detail: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	const id = match.params.id;
	const user = useLoggedInUser();
	const [problem, loading, imageUrl, error] = useDetail(id);
	const [resolved, setResolved] = useState(problem?.resolved !== null);
	const [savingResolved, setSavingResolved] = useState(false);

	// Submit handler
	const handleResolve = async (id: string) => {
		setSavingResolved(true);
		await resolveProblem(id);
		setResolved(true);
		setSavingResolved(false);
	};

	if (loading) {
		return (
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
		);
	}

	if (error !== '' || problem === undefined) {
		return <Typography>{error}</Typography>;
	}

	return (
		<Box
			sx={{
				bgcolor: 'background.paper',
				pt: 8,
				pb: 6
			}}
		>
			<Grid container spacing={6} mb={6}>
				<Grid item lg={8} md={7} sm={12}>
					<img width="100%" src={imageUrl} alt={problem.title} />
				</Grid>
				<Grid item lg={4} md={5} sm={12}>
					<Stack spacing={1}>
						<Typography mb={2} variant="h3">
							{problem.title}
						</Typography>
						{/* TODO get author name */}
						<Typography sx={{ fontSize: '1.5rem' }}>
							Autor: {problem.author}
						</Typography>
						<Typography sx={{ fontSize: '1.5rem' }}>
							Category: {problem.category}
						</Typography>
						<Typography sx={{ fontSize: '1.5rem' }}>
							Lokace: {problem.location}
						</Typography>
						<Typography sx={{ fontSize: '1.5rem' }}>
							Vytvořeno: {problem.created.toDate().toLocaleDateString()}
						</Typography>
						<Box mt={1}>
							{problem.resolved !== null ? (
								<Typography
									sx={{ color: 'success.main', fontWeight: '700' }}
									variant="h4"
								>
									Vyřešen {problem.resolved.toDate().toLocaleDateString()}
								</Typography>
							) : (
								<Typography
									sx={{ color: 'primary.main', fontWeight: '700' }}
									variant="h4"
								>
									Přetrvávající
								</Typography>
							)}
						</Box>
						{user?.uid === problem.author &&
							problem.resolved === null &&
							!resolved && (
								<Box mb={2} sx={{ width: '100%', textAlign: 'center' }}>
									<LoadingButton
										startIcon={<DoneIcon />}
										color="success"
										variant="outlined"
										loading={savingResolved}
										onClick={() => handleResolve(problem.id)}
										loadingPosition="start"
									>
										Vyřešit
									</LoadingButton>
								</Box>
							)}
					</Stack>
				</Grid>
			</Grid>
			<Box>
				<Typography mb={2} variant="h4">
					Popis:
				</Typography>
				<Typography sx={{ fontSize: '1.5rem' }}>
					{problem.description}
				</Typography>
			</Box>
		</Box>
	);
};

export default Detail;

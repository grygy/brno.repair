import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	FormControlLabel,
	Grid,
	Radio,
	RadioGroup,
	Typography
} from '@mui/material';
import { DocumentData, QueryDocumentSnapshot } from '@firebase/firestore';
import { LoadingButton } from '@mui/lab';

import ProblemPreview from '../components/ProblemPreview';
import {
	ProblemWithId,
	getProblemsWithPagination,
	Category,
	categories,
	LIMIT_PAGINATION
} from '../utils/firebase';
import usePageTitle from '../hooks/usePageTitle';

const Problems = () => {
	usePageTitle('Problemy');

	const [loading, setLoading] = useState(true);
	const [problems, setProblems] = useState<ProblemWithId[]>([]);
	const [lastVisible, setLastVisible] = useState<
		QueryDocumentSnapshot<DocumentData> | undefined
	>(undefined);
	const [fetching, setFetching] = useState(false);
	const [isThereNext, setIsThereNext] = useState(true);
	const [category, setCategory] = useState<Category | undefined>(undefined);
	const [resolved, setResolved] = useState<boolean | undefined>(undefined);
	const [filterData, setFilterData] = useState<
		[Category | undefined, boolean | undefined]
	>([undefined, undefined]);

	const setData = async () => {
		const [newProblems, last] = await getProblemsWithPagination(
			lastVisible,
			filterData[0],
			filterData[1]
		);
		setProblems([...problems, ...newProblems]);
		setLastVisible(last);
		if (newProblems.length < LIMIT_PAGINATION || newProblems.length === 0) {
			setIsThereNext(false);
		}
	};

	const filter = async () => {
		const [newProblems, last] = await getProblemsWithPagination(
			undefined,
			category,
			resolved
		);
		setProblems(newProblems);
		setLastVisible(last);
		setFilterData([category, resolved]);
		setIsThereNext(true);
		if (newProblems.length === 0) {
			setIsThereNext(false);
		}
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
		<Box mt={4} mb={4}>
			<Typography variant="h2" mb={4}>
				Seznam probl??m??
			</Typography>

			<FormControl sx={{ mb: 6, width: '100%', textAlign: 'left' }}>
				<Typography mb={4} variant="h4" color="textSecondary">
					Filtrov??n??
				</Typography>
				<Grid container spacing={6}>
					<Grid item lg={6} md={6} sm={6} xs={12}>
						<Typography color="textSecondary">KATEGORIE:</Typography>
						<RadioGroup
							aria-label="category"
							defaultValue="All"
							name="problem-category"
							onChange={e => {
								if (e.target.value === 'All') {
									setCategory(undefined);
								} else {
									setCategory(e.target.value as Category);
								}
							}}
						>
							<FormControlLabel value="All" control={<Radio />} label="V??e" />
							{categories.map(category => (
								<FormControlLabel
									key={category}
									value={category}
									control={<Radio />}
									label={category}
								/>
							))}
						</RadioGroup>
					</Grid>
					<Grid item lg={6} md={6} sm={6} xs={12}>
						<Typography color="textSecondary">VY??E??ENO:</Typography>
						<RadioGroup
							aria-label="resolved"
							defaultValue="0"
							name="problem-category"
							onChange={e => {
								const res = e.target.value;
								switch (res) {
									case '0':
										setResolved(undefined);
										break;
									case '1':
										setResolved(true);
										break;
									case '2':
										setResolved(false);
										break;
									default:
										setResolved(undefined);
										break;
								}
							}}
						>
							<FormControlLabel
								value="0"
								control={<Radio />}
								label="V??echny probl??my"
							/>
							<FormControlLabel
								value="1"
								control={<Radio />}
								label="Vy??e??en?? probl??my"
							/>
							<FormControlLabel
								value="2"
								control={<Radio />}
								label="Nevy??e??en?? probl??my"
							/>
						</RadioGroup>
					</Grid>
				</Grid>
				<Button
					variant="contained"
					sx={{ width: '200px', mt: 2 }}
					onClick={async () => {
						setLoading(true);
						setProblems([]);
						setLastVisible(undefined);
						await filter();
						setLoading(false);
					}}
				>
					Filtrovat
				</Button>
			</FormControl>
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
				<Grid container sx={{ width: '100%', textAlign: 'center' }} spacing={2}>
					{problems.length === 0 && (
						<Box mt={4} mb={4} sx={{ textAlign: 'center' }}>
							<Typography variant="h4" align="center">
								Nebyly nalezeny probl??my odpov??daj??c?? va??emu v??b??ru.
							</Typography>
						</Box>
					)}
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
			<Box
				hidden={!isThereNext}
				mb={6}
				mt={6}
				sx={{ width: '100%', textAlign: 'center' }}
			>
				<LoadingButton
					variant="outlined"
					loading={fetching}
					onClick={fetchMoreProblems}
				>
					Na????st dal????...
				</LoadingButton>
			</Box>
		</Box>
	);
};

export default Problems;

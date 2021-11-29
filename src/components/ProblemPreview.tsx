import { setTimeout } from 'timers';

import { LoadingButton } from '@mui/lab';
import {
	Box,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	CircularProgress,
	Divider,
	Typography
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { FC, useEffect, useState } from 'react';

import useLoggedInUser from '../hooks/useLoggedInUser';
import { getImage, ProblemWithId, resolveProblem } from '../utils/firebase';

type Props = {
	problem: ProblemWithId;
};
const ProblemPreview: FC<Props> = ({ problem }) => {
	const user = useLoggedInUser();
	const [savingResolved, setSavingResolved] = useState(false);
	const [image, setImage] = useState('');
	const [loading, setLoading] = useState(true);
	const [resolved, setResolved] = useState(problem.resolved !== null);

	useEffect(() => {
		(async () => {
			setImage(await getImage(problem.id));
			setLoading(false);
		})();
	}, []);

	// Submit handler
	const handleResolve = async (id: string) => {
		setSavingResolved(true);
		await resolveProblem(id);
		setResolved(true);
		setSavingResolved(false);
	};

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<Card
			sx={{
				justifyContent: 'start',
				width: '100%',
				textAlign: 'left',
				borderColor: '#cb0e21'
			}}
		>
			<CardMedia
				component="img"
				height="auto"
				image={image}
				alt="Fotka problemu"
			/>
			<CardContent>
				<Typography variant="h5" color="textSecondary">
					{problem.title}
				</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography color="textSecondary">
					<b>Kategorie: </b> {problem.category}
				</Typography>
				{(resolved || problem.resolved !== null) && (
					<Box mt={2} sx={{ color: 'success.main', textAlign: 'center' }}>
						<Typography variant="h6">Problem was solved</Typography>
					</Box>
				)}
			</CardContent>
			{user?.uid === problem.author && problem.resolved === null && !resolved && (
				<CardActions>
					<Box mb={2} sx={{ width: '100%', textAlign: 'center' }}>
						<LoadingButton
							startIcon={<DoneIcon />}
							color="success"
							variant="outlined"
							loading={savingResolved}
							onClick={() => handleResolve(problem.id)}
							loadingPosition="start"
						>
							Vyřešit problém
						</LoadingButton>
					</Box>
				</CardActions>
			)}
		</Card>
	);
};

export default ProblemPreview;

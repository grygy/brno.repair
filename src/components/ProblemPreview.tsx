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
import { getImage, ProblemWithId } from '../utils/firebase';

type Props = {
	problem: ProblemWithId;
};
const ProblemPreview: FC<Props> = ({ problem }) => {
	const user = useLoggedInUser();
	const [savingResolved, setSavingResolved] = useState(false);
	const [image, setImage] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			setImage(await getImage(problem.id));
			setLoading(false);
		})();
	}, []);

	// Submit handler
	const handleResolve = async () => {
		setSavingResolved(true);
		// TODO
		// console.log('trying to delete');
		// if (!user?.email) {
		// 	return;
		// }
		// try {
		// 	await deleteDoc(reviewsDocument(user.email));
		// } catch (err) {
		// 	alert((err as { message?: string })?.message ?? 'Unknown error occurred');
		// }
		setTimeout(() => {
			setSavingResolved(false);
		}, 2000);
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
			</CardContent>
			{user?.uid === problem.author && (
				<CardActions>
					<Box mb={2} sx={{ width: '100%', textAlign: 'center' }}>
						<LoadingButton
							startIcon={<DoneIcon />}
							color="success"
							variant="outlined"
							loading={savingResolved}
							onClick={handleResolve}
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

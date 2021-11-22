import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Divider,
	Typography
} from '@mui/material';
import { FC } from 'react';

import useLoggedInUser from '../hooks/useLoggedInUser';
import { Problem } from '../utils/firebase';

type Props = {
	problem: Problem;
};
const ProblemPreview: FC<Props> = ({ problem }) => {
	const user = useLoggedInUser();

	// Submit handler
	const handleResolve = async () => {
		// console.log('trying to delete');
		// if (!user?.email) {
		// 	return;
		// }
		// try {
		// 	await deleteDoc(reviewsDocument(user.email));
		// } catch (err) {
		// 	alert((err as { message?: string })?.message ?? 'Unknown error occurred');
		// }
	};

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'start',
				width: '100%',
				textAlign: 'left',
				minWidth: '300px',
				borderColor: '#cb0e21'
			}}
		>
			<CardMedia
				component="img"
				height="192"
				image="logo192.png"
				alt="Fotka problemu"
			/>
			<CardContent>
				<Typography variant="h5" color="textSecondary">
					{problem.title}
				</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography color="textSecondary">
					<b>Kategoria: </b> {problem.category}
				</Typography>
			</CardContent>
			{user?.uid === problem.author && (
				<CardActions>
					<Button color="success" variant="outlined" onClick={handleResolve}>
						Vyriesit problem
					</Button>
				</CardActions>
			)}
		</Card>
	);
};

export default ProblemPreview;

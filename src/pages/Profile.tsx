import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	TextField,
	Typography
} from '@mui/material';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { LoadingButton } from '@mui/lab';

import {
	addUserProfile,
	getUserProblems,
	getUserProfile,
	ProblemWithId,
	updateUserProfile,
	UserProfile
} from '../utils/firebase';
import useLoggedInUser from '../hooks/useLoggedInUser';
import ProblemPreview from '../components/ProblemPreview';

const Profile = () => {
	const user = useLoggedInUser();
	const [userProfile, setUserProfile] = useState<UserProfile | undefined>(
		undefined
	);

	const [loading, setLoading] = useState(true);
	type ShowAlert = 'none' | 'info' | 'error' | 'success';
	const [showAlert, setShowAlert] = useState<ShowAlert>('none');
	const [saveLoading, setSaveLoading] = useState<boolean>(false);
	const [resetLoading, setResetLoading] = useState<boolean>(false);

	const [userName, setUserName] = useState<string>('');
	const [userSurname, setUserSurname] = useState<string>('');

	const auth = getAuth();

	const [problems, setProblems] = useState<ProblemWithId[]>([]);
	const [problemsLoading, setProblemsLoading] = useState(true);
	useEffect(() => {
		(async () => {
			const res = await getUserProblems(user?.email ?? '');
			setProblems(res);
			setProblemsLoading(false);
		})();
	}, [user?.email]);

	useEffect(() => {
		(async () => {
			if (user?.email) {
				const res = await getUserProfile(user?.email ?? '');
				setUserProfile(res);
				if (res) {
					setUserName(res.name);
					setUserSurname(res.surname);
				}
				setLoading(false);
			}
		})();
	}, [user?.email]);

	const handleSubmit = async () => {
		setSaveLoading(true);
		if (userProfile === undefined) {
			// add new doc into DB
			const newProfile: UserProfile = {
				email: user?.email ?? '',
				name: userName,
				surname: userSurname
			};
			await addUserProfile(newProfile);
		} else {
			// update existing doc with name and surname
			await updateUserProfile(user?.email ?? '', userName, userSurname);
		}
		setShowAlert('success');
		setSaveLoading(false);
	};
	if (loading) {
		return <CircularProgress />;
	}
	return (
		<Box mt={4}>
			<Typography variant="h2" mb={4}>
				Muj profil
			</Typography>

			<Box
				component="form"
				sx={{
					'& .MuiTextField-root': { m: 1, width: '25ch' }
				}}
				noValidate
				autoComplete="off"
			>
				<div>
					<TextField
						label="Meno"
						defaultValue={userName}
						onChange={e => setUserName(e.target.value)}
					/>
					<TextField
						label="Prievzisko"
						defaultValue={userSurname}
						onChange={e => setUserSurname(e.target.value)}
					/>
				</div>
				<div>
					<TextField label="E-mail" defaultValue={user?.email} disabled />
				</div>
			</Box>

			<Box
				sx={{
					'& .MuiTextField-root': { m: 1, width: '25ch' }
				}}
				m={2}
				display="flex"
				justifyContent="left"
			>
				<LoadingButton
					loading={resetLoading}
					// loadingPosition="end"
					sx={{ marginRight: '10px' }}
					color="error"
					variant="contained"
					onClick={async () => {
						setResetLoading(true);
						await sendPasswordResetEmail(auth, user?.email ?? '')
							.then(() => {
								setShowAlert('info');
							})
							.catch(() => {
								setShowAlert('error');
							});
						setResetLoading(false);
					}}
				>
					Obnovit heslo
				</LoadingButton>

				<LoadingButton
					loading={saveLoading}
					// loadingPosition="end"
					variant="contained"
					sx={{ marginLeft: '10px' }}
					color="success"
					onClick={handleSubmit}
				>
					Ulozit zmeny
				</LoadingButton>
			</Box>

			<div>
				<Dialog
					open={showAlert !== 'none'}
					onClose={() => setShowAlert('none')}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{showAlert === 'info' && <div> Obnova hesla uspesna </div>}
						{showAlert === 'success' && <div> Zmena udajov uspesna </div>}
						{showAlert === 'error' && <div> Operacia nebola uspesna </div>}
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{showAlert === 'info' && (
								<div> Pokyny k zmene hesla boli odoslane na vas email. </div>
							)}
							{showAlert === 'success' && (
								<div> Meno a priezvisko boli akutalizovane. </div>
							)}
							{showAlert === 'error' && (
								<div> Zial, nastala chyba. Skuste to neskor, prosim. </div>
							)}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowAlert('none')}>okay</Button>
					</DialogActions>
				</Dialog>
			</div>

			{problemsLoading ? (
				<CircularProgress />
			) : (
				<Box
					sx={{
						bgcolor: 'background.paper',
						pt: 6,
						pb: 6
					}}
				>
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
				</Box>
			)}
		</Box>
	);
};

export default Profile;

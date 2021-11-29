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
	TextField,
	Typography
} from '@mui/material';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';

import {
	addUserProfile,
	getUserProfile,
	updateUserProfile,
	UserProfile
} from '../utils/firebase';
import useLoggedInUser from '../hooks/useLoggedInUser';

const Profile = () => {
	const user = useLoggedInUser();

	const [userProfile, setUserProfile] = useState<UserProfile | undefined>(
		undefined
	);
	const [loading, setLoading] = useState(true);
	type ShowAlert = 'none' | 'info' | 'error' | 'success';
	const [showAlert, setShowAlert] = useState<ShowAlert>('none');

	const [userName, setUserName] = useState<string>('');
	const [userSurname, setUserSurname] = useState<string>('');

	const auth = getAuth();

	useEffect(() => {
		(async () => {
			if (user?.email) {
				console.log('volam sa');
				const res = await getUserProfile(user?.email ?? '');
				console.log(res);
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
	};
	if (loading) {
		return <CircularProgress />;
	}
	return (
		<>
			<Typography variant="h1">Muj profil</Typography>

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
				<Button
					sx={{ marginRight: '10px' }}
					color="error"
					variant="contained"
					onClick={() => {
						sendPasswordResetEmail(auth, user?.email ?? '')
							.then(() => {
								setShowAlert('info');
							})
							.catch(() => {
								setShowAlert('error');
							});
					}}
				>
					Obnovit heslo
				</Button>

				<Button
					sx={{ marginLeft: '10px' }}
					color="success"
					variant="contained"
					onClick={handleSubmit}
				>
					Ulozit zmeny
				</Button>
				<LoadingButton
					endIcon={<SendIcon />}
					loading={loading}
					loadingPosition="end"
					variant="contained"
					sx={{ marginLeft: '10px' }}
					color="success"
					onClick={handleSubmit}
				>
					Save
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
		</>
	);
};

export default Profile;

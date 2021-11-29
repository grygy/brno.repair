import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	TextField,
	Typography
} from '@mui/material';

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

	const [userName, setUserName] = useState<string>(userProfile?.name ?? '');
	const [userSurname, setUserSurname] = useState<string>(
		userProfile?.name ?? ''
	);

	console.log(user?.email);

	// console.log(userName, userSurname);
	// console.log(userProfile);

	useEffect(() => {
		(async () => {
			if (user?.email) {
				console.log('volam sa');
				setUserProfile(await getUserProfile(user?.email ?? ''));
				// setUserName(userProfile?.name ?? '');
				// setUserSurname(userProfile?.surname ?? '');
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
				<Button sx={{ marginRight: '10px' }} color="error" variant="contained">
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
			</Box>
		</>
	);
};

export default Profile;

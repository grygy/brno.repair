import { FC } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Container, Toolbar, Button, Box } from '@mui/material';

import useLoggedInUser from '../hooks/useLoggedInUser';
import { signOut } from '../utils/firebase';

const Layout: FC = ({ children }) => {
	const user = useLoggedInUser();
	return (
		<>
			<AppBar position="fixed">
				<Container maxWidth="lg">
					<Toolbar disableGutters sx={{ gap: 2 }}>
						<Button color="secondary" component={Link} to="/">
							Domů
						</Button>
						<Button color="secondary" component={Link} to="/problems">
							Problémy
						</Button>
						<Button color="secondary" component={Link} to="/upload-new-problem">
							Nahrát problém
						</Button>
						<Box sx={{ flexGrow: 1 }} />
						{user && (
							<Button color="secondary" component={Link} to="/profile">
								Profil
							</Button>
						)}
						{!user ? (
							<Button color="secondary" component={Link} to="/login">
								Přihlásit se
							</Button>
						) : (
							<Button color="secondary" onClick={signOut}>
								Odhlásit se
							</Button>
						)}
					</Toolbar>
				</Container>
			</AppBar>

			<Container
				maxWidth="sm"
				component="main"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					pt: 8,
					gap: 2
				}}
			>
				{children}
			</Container>
		</>
	);
};
export default Layout;

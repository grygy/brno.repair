import { FC } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Container, Toolbar, Button, Box } from '@mui/material';

const Layout: FC = ({ children }) => {
	const user = undefined;
	return (
		<>
			<AppBar position="fixed">
				<Container maxWidth="sm">
					<Toolbar disableGutters sx={{ gap: 2 }}>
						<Button component={Link} to="/">
							Domů
						</Button>
						<Button component={Link} to="/problems">
							Problémy
						</Button>
						<Button component={Link} to="/upload-new-problem">
							Nahrát problém
						</Button>
						<Box sx={{ flexGrow: 1 }} />
						{user && (
							<Button component={Link} to="/profile">
								Profil
							</Button>
						)}
						{!user ? (
							<Button component={Link} to="/login">
								Přihlásit se
							</Button>
						) : (
							<Button>Odhlásit se</Button>
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

import React, { FC, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
	AppBar,
	Container,
	Toolbar,
	Button,
	Box,
	Menu,
	MenuItem,
	IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import useLoggedInUser from '../hooks/useLoggedInUser';
import { signOut } from '../utils/firebase';

const Layout: FC = ({ children }) => {
	const user = useLoggedInUser();
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const history = useHistory();
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSignOut = () => {
		history.push('/');
		signOut();
	};

	window.addEventListener('resize', () => {
		setWindowWidth(window.innerWidth);
	});

	useEffect(() => {
		setWindowWidth(window.innerWidth);
	}, [window.innerWidth]);

	return (
		<>
			<AppBar position="fixed">
				<Container maxWidth="lg">
					<Toolbar disableGutters sx={{ gap: 2 }}>
						{windowWidth >= 600 ? (
							<>
								<Button color="secondary" component={Link} to="/">
									Domů
								</Button>
								<Button color="secondary" component={Link} to="/problems">
									Problémy
								</Button>
								<Button
									color="secondary"
									component={Link}
									to="/upload-new-problem"
								>
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
									<Button color="secondary" onClick={handleSignOut}>
										Odhlásit se
									</Button>
								)}
							</>
						) : (
							<>
								<Button color="secondary" component={Link} to="/">
									Brno.Repair
								</Button>
								<Box sx={{ flexGrow: 1 }} />
								<IconButton
									id="basic-button"
									aria-controls="basic-menu"
									aria-haspopup="true"
									aria-expanded={open ? 'true' : undefined}
									onClick={handleClick}
									sx={{ color: 'white' }}
								>
									<MenuIcon />
								</IconButton>
								<Menu
									id="basic-menu"
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
									MenuListProps={{
										'aria-labelledby': 'basic-button'
									}}
								>
									<MenuItem onClick={handleClose} component={Link} to="/">
										Domů
									</MenuItem>
									<MenuItem
										onClick={handleClose}
										component={Link}
										to="/problems"
									>
										Problémy
									</MenuItem>
									<MenuItem
										onClick={handleClose}
										component={Link}
										to="/upload-new-problem"
									>
										Nahrát problém
									</MenuItem>
									{user && (
										<MenuItem
											onClick={handleClose}
											component={Link}
											to="/profile"
										>
											Profil
										</MenuItem>
									)}
									{!user ? (
										<MenuItem
											onClick={handleClose}
											component={Link}
											to="/login"
										>
											Přihlásit se
										</MenuItem>
									) : (
										<MenuItem
											onClick={() => {
												handleClose();
												handleSignOut();
											}}
										>
											Odhlásit se
										</MenuItem>
									)}
								</Menu>
							</>
						)}
					</Toolbar>
				</Container>
			</AppBar>

			<Container
				maxWidth="lg"
				component="main"
				sx={{
					justifyContent: 'center',
					alignItems: 'center',

					pt: 8
				}}
			>
				{children}
			</Container>
		</>
	);
};
export default Layout;

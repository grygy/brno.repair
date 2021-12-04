import { useState } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	TextField,
	Typography,
	Stack,
	styled
} from '@mui/material';
import { Timestamp } from '@firebase/firestore';
import Compressor from 'compressorjs';
import { LoadingButton } from '@mui/lab';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useHistory } from 'react-router-dom';

import {
	addProblem,
	categories,
	Category,
	uploadImage
} from '../utils/firebase';
import useLoggedInUser from '../hooks/useLoggedInUser';
import usePageTitle from '../hooks/usePageTitle';
import useField from '../hooks/useField';

const UploadNewProblem = () => {
	usePageTitle('Novy problem');
	const history = useHistory();

	const user = useLoggedInUser();
	const [image, setImage] = useState<File | null>(null);
	const [problemName, problemNameProps] = useField('name', true);
	const [problemLocation, problemLocationProps] = useField('name', true);
	const [problemCategory, setProblemCategory] = useState<Category>('Ine');
	const [problemDescription, problemDescriptionProps] = useField(
		'description',
		false
	);
	const [saveLoading, setSaveLoading] = useState<boolean>(false);
	const [dialogState, setDialogState] = useState<'none' | 'success' | 'error'>(
		'none'
	);

	const handleFileChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		const files = (event.target as HTMLInputElement).files;
		if (files) {
			const file = files[0];
			setImage(file);
		}
	};

	const Input = styled('input')({
		display: 'none'
	});

	if (!user) {
		return (
			<Box my={4}>
				<Typography variant="h4">
					Na pridanie problemu je potrebne sa prihlasit
				</Typography>
				<Button
					sx={{ marginTop: 4 }}
					variant="contained"
					onClick={() => history.push('/login')}
				>
					Prihlasit sa
				</Button>
			</Box>
		);
	}
	return (
		<>
			<Box component="form" my={4} noValidate autoComplete="off">
				<Typography variant="h2" mb={4}>
					Novy problem
				</Typography>
				<FormControl>
					<TextField
						label="Nazev"
						{...problemNameProps}
						sx={{ marginBottom: 1 }}
					/>
					<TextField
						label="Lokace"
						{...problemLocationProps}
						sx={{ marginBottom: 3 }}
					/>
					<FormLabel component="legend">Kategoria</FormLabel>
					<RadioGroup
						aria-label="caregory"
						defaultValue="Ine"
						value={problemCategory}
						name="problem-category"
						onChange={e => setProblemCategory(e.target.value as Category)}
					>
						{categories.map(category => (
							<FormControlLabel
								key={category}
								value={category}
								control={<Radio />}
								label={category}
							/>
						))}
					</RadioGroup>
					<TextField
						label="Popis problemu"
						{...problemDescriptionProps}
						multiline
						minRows={4}
						sx={{ marginTop: 3, marginBottom: 3 }}
					/>
					<FormLabel component="legend">Obrazok problemu</FormLabel>
					<Stack direction="row" alignItems="center" spacing={2}>
						<Typography variant="caption" sx={{ marginLeft: 0.5 }}>
							{image === null
								? 'Nie je vybrany ziadny subor...'
								: `${image.name}`}
						</Typography>
						<label htmlFor="icon-button-file">
							<Input
								accept="image/*"
								id="icon-button-file"
								type="file"
								onChange={handleFileChange}
								required
							/>
							<IconButton
								color="primary"
								aria-label="upload picture"
								component="span"
							>
								<PhotoCamera />
							</IconButton>
						</label>
					</Stack>
					<LoadingButton
						sx={{ marginTop: 1 }}
						loading={saveLoading === true}
						loadingPosition="end"
						variant="contained"
						onClick={async () => {
							setSaveLoading(true);
							if (image && problemName && problemLocation) {
								const supportedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
								if (supportedTypes.includes(image.type)) {
									const id = await addProblem({
										author: user?.email ?? '',
										category: problemCategory,
										created: Timestamp.now(),
										description: problemDescription,
										location: problemLocation,
										resolved: 'null',
										title: problemName
									});
									// compress image
									new Compressor(image, {
										quality: 0.6,
										maxWidth: 1500,
										maxHeight: 1500,
										convertSize: 700000,
										mimeType: 'image/jpeg',
										success: async result => {
											const file = new File([result], `${id}.jpg`, {
												type: 'image/jpeg'
											});
											try {
												await uploadImage(file);
												setSaveLoading(false);
												setDialogState('success');
											} catch {
												alert('Nahratie obrazku sa nepodarilo');
											}
										}
									});
								}
							} else {
								setSaveLoading(false);
								setDialogState('error');
							}
						}}
					>
						Add problem
					</LoadingButton>
				</FormControl>
			</Box>
			<Dialog
				open={dialogState === 'success'}
				onClose={() => setDialogState('none')}
			>
				<DialogTitle id="alert-dialog-title">
					Problem uspesne nahrany
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Mozte si ho pozriet v zozname problemov
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => history.push('/problems')}>okay</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={dialogState === 'error'}
				onClose={() => setDialogState('none')}
			>
				<DialogTitle id="alert-dialog-title">
					Nedostatok informacii na vytvorenie problemu
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Nie vsetky povinne polozky (nazov, lokacia a obrazok) boli vyplnene.
						Doplnte ich a skuste to znova.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogState('none')}>okay</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default UploadNewProblem;

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

import {
	addProblem,
	categories,
	Category,
	uploadImage
} from '../utils/firebase';
import useLoggedInUser from '../hooks/useLoggedInUser';
import usePageTitle from '../hooks/usePageTitle';

const UploadNewProblem = () => {
	usePageTitle('Novy problem');

	const user = useLoggedInUser();
	const [image, setImage] = useState<File | null>(null);
	const [problemName, setProblemName] = useState<string>('');
	const [problemLocation, setProblemLocation] = useState<string>('');
	const [problemCategory, setProblemCategory] = useState<Category>('Ine');
	const [problemDescription, setProblemDescription] = useState<string>('');
	const [saveLoading, setSaveLoading] = useState<'true' | 'false' | 'alert'>(
		'false'
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

	const resetFields = () => {
		setImage(null);
		setProblemName('');
		setProblemLocation('');
		setProblemCategory('Ine');
		setProblemDescription('');
	};

	const Input = styled('input')({
		display: 'none'
	});
	return (
		<>
			<Box component="form" my={4} noValidate autoComplete="off">
				<Typography variant="h2" mb={4}>
					Novy problem
				</Typography>
				<FormControl>
					<TextField
						required
						label="Nazev"
						defaultValue=""
						value={problemName}
						onChange={e => setProblemName(e.target.value)}
						sx={{ marginBottom: 1 }}
					/>
					<TextField
						required
						label="Lokace"
						defaultValue=""
						value={problemLocation}
						onChange={e => setProblemLocation(e.target.value)}
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
						id="problem-description"
						label="Popis problemu"
						placeholder=""
						multiline
						minRows={4}
						value={problemDescription}
						onChange={e => setProblemDescription(e.target.value)}
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
						loading={saveLoading === 'true'}
						loadingPosition="end"
						variant="contained"
						onClick={async () => {
							setSaveLoading('true');
							// TODO: pridat orezeany nahladovy obrazok
							if (image) {
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
											await uploadImage(file);
										}
									});
								}
							}
							setSaveLoading('alert');
							resetFields();
						}}
					>
						Add problem
					</LoadingButton>
				</FormControl>
			</Box>
			<Dialog
				open={saveLoading === 'alert'}
				onClose={() => setSaveLoading('false')}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
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
					<Button onClick={() => setSaveLoading('false')}>okay</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default UploadNewProblem;

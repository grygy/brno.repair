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
	Input,
	Radio,
	RadioGroup,
	TextField
} from '@mui/material';
import { Timestamp } from '@firebase/firestore';
import Compressor from 'compressorjs';
import { LoadingButton } from '@mui/lab';

import {
	addProblem,
	categories,
	Category,
	uploadImage
} from '../utils/firebase';
import useLoggedInUser from '../hooks/useLoggedInUser';

const UploadNewProblem = () => {
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
		console.log(event);
		const files = (event.target as HTMLInputElement).files;
		if (files) {
			const file = files[0];
			console.log(file);
			setImage(file);
		}
	};

	return (
		<>
			<Box
				component="form"
				mt={2}
				sx={{
					'& .MuiTextField-root': { m: 1, width: '25ch' }
				}}
				noValidate
				autoComplete="off"
			>
				<FormControl>
					<TextField
						required
						label="Nazev"
						defaultValue=""
						onChange={e => setProblemName(e.target.value)}
					/>
					<TextField
						required
						label="Lokace"
						defaultValue=""
						onChange={e => setProblemLocation(e.target.value)}
					/>
					<FormLabel component="legend">Kategoria</FormLabel>
					<RadioGroup
						aria-label="caregory"
						defaultValue="Ine"
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
						onChange={e => setProblemDescription(e.target.value)}
					/>
					<label htmlFor="contained-button-file">
						<Input
							// accept=".png,.jpg,.jpeg"
							id="contained-button-file"
							type="file"
							onChange={handleFileChange}
						/>
					</label>

					<LoadingButton
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
										author: user?.uid ?? '',
										category: problemCategory,
										created: Timestamp.now(),
										description: problemDescription,
										location: problemLocation,
										resolved: null,
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
											console.log('Uploading image');
											await uploadImage(file);
											console.log('Image uploaded');
										}
									});
								}
							}
							setSaveLoading('alert');
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

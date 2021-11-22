import { type } from 'os';

import React, { ChangeEvent, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Timestamp } from '@firebase/firestore';
import Compressor from 'compressorjs';

import { addProblem, getImage, uploadImage } from '../utils/firebase';
import useLoggedInUser from '../hooks/useLoggedInUser';

const UploadNewProblem = () => {
	const user = useLoggedInUser();
	const [image, setImage] = useState<File | null>(null);
	const [idExample, setIdExample] = useState('');

	const handleChange = (e: { target: { files: any } }) => {
		const files = e.target.files;
		if (files) {
			const file = files[0];
			setImage(file);
		}
	};

	return (
		<Box>
			<input type="file" onChange={handleChange} accept=".png,.jpg,.jpeg" />
			<Button
				onClick={async () => {
					if (image) {
						const supportedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
						if (supportedTypes.includes(image.type)) {
							const id = await addProblem({
								author: user?.uid ?? '',
								category: 'Doprava',
								created: Timestamp.now(),
								description: 'Sample text',
								location: 'sample location',
								resolved: null,
								title: 'awwwwww problem'
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
				}}
			>
				Add simple problem
			</Button>
			<img src={idExample} alt="s" />
		</Box>
	);
};

export default UploadNewProblem;

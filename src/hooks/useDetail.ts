import { useEffect, useState } from 'react';

import {
	getImage,
	getProblem,
	getUserProfile,
	ProblemWithId,
	UserProfile
} from './../utils/firebase';

const useDetail = (id: string) => {
	const [problem, setProblem] = useState<undefined | ProblemWithId>(undefined);
	const [loading, setLoading] = useState(true);
	const [imageUrl, setImageUrl] = useState('');
	const [resolved, setResolved] = useState(false);
	const [userDetail, setUserDetail] = useState<UserProfile | undefined>(
		undefined
	);
	const [error, setError] = useState('');

	const getData = async () => {
		try {
			const results = await Promise.all([getProblem(id), getImage(id)]);
			setProblem(results[0]);
			setImageUrl(results[1]);
			setUserDetail(await getUserProfile(results[0].author));
			setResolved(results[0].resolved !== 'null');
			setLoading(false);
		} catch (err) {
			setLoading(false);
			setError((err as { message?: string })?.message ?? 'Neznámá chyba');
		}
	};

	useEffect(() => {
		(async () => {
			await getData();
		})();
	}, []);

	useEffect(() => {
		(async () => {
			await getData();
		})();
	}, [resolved]);

	return [
		problem,
		loading,
		imageUrl,
		error,
		resolved,
		userDetail,
		setResolved
	] as const;
};

export default useDetail;

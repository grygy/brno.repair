import { useEffect, useState } from 'react';

import { getImage, getProblem, ProblemWithId } from './../utils/firebase';

const useDetail = (id: string) => {
	const [problem, setProblem] = useState<undefined | ProblemWithId>(undefined);
	const [loading, setLoading] = useState(true);
	const [imageUrl, setImageUrl] = useState('');
	const [resolved, setResolved] = useState(false);
	const [error, setError] = useState('');

	const getData = async () => {
		try {
			const results = await Promise.all([getProblem(id), getImage(id)]);
			setProblem(results[0]);
			setImageUrl(results[1]);
			setResolved(results[0].resolved !== null);
			setLoading(false);
		} catch (err) {
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

	return [problem, loading, imageUrl, error, resolved, setResolved] as const;
};

export default useDetail;

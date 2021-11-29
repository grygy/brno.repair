import { useEffect, useState } from 'react';

import { getImage, getProblem, ProblemWithId } from './../utils/firebase';

const useDetail = (id: string) => {
	const [problem, setProblem] = useState<undefined | ProblemWithId>(undefined);
	const [loading, setLoading] = useState(true);
	const [imageUrl, setImageUrl] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		(async () => {
			try {
				const results = await Promise.all([getProblem(id), getImage(id)]);
				setProblem(results[0]);
				setImageUrl(results[1]);
				setLoading(false);
			} catch (err) {
				setError((err as { message?: string })?.message ?? 'Neznámá chyba');
			}
		})();
	}, []);

	return [problem, loading, imageUrl, error] as const;
};

export default useDetail;

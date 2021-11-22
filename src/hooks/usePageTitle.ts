import { useEffect } from 'react';

const usePageTitle = (title: string) => {
	useEffect(() => {
		document.title = `Brno.Repair | ${title}`;
	}, [title]);
};

export default usePageTitle;

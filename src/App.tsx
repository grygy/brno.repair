import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import Layout from './components/Layout';
import Routes from './components/Routes';

const App = () => (
	<BrowserRouter>
		<CssBaseline />
		<Layout>
			<Routes />
		</Layout>
	</BrowserRouter>
);

export default App;

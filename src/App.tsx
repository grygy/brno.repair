import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import Layout from './components/Layout';
import Routes from './components/Routes';
import theme from './utils/theme';

const App = () => (
	<ThemeProvider theme={theme}>
		<BrowserRouter>
			<CssBaseline />
			<Layout>
				<Routes />
			</Layout>
		</BrowserRouter>
	</ThemeProvider>
);

export default App;

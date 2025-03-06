import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css';
import App from './App';

// Our custom theme
const theme = createTheme({
	palette: {
		primary: {
			main: '#485696',
		},
		secondary: {
			main: '#e7e7e7',
		},
		warning: {
			main: '#f9c784',
		},
		error: {
			main: '#fc7a1e',
		},
		info: {
			main: '#f24c00',
		},
		black: {
			main: '#000000',
		},
		ColorDelete: {
			main: '#cf0021',
		},
	},
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</StrictMode>
);


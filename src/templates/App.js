import '../assets/css/app.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PlayerDatas from './module/PlayerDatas';
import PrimarySearchAppBar from './base/Header';

const darkTheme = createTheme({
	palette: {
	  mode: 'dark',
	},
});

function App() {


	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<div className="App">
				{/*<PrimarySearchAppBar />*/}
				<div className="module" style={{padding: '3rem'}}>
					<PlayerDatas />
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;

import '../assets/css/app.css';

import Header from './base/Header'
import SideBar from './base/SideBar'
import PlayerDatas from './module/PlayerDatas'


function App() {


	return (
		<div className="App">
			<Header />
			<SideBar />
			<div className="module">
				<PlayerDatas />
			</div>

		</div>
	);
}

export default App;


import Header from './base/header';
import {useState} from "react";

function Content() {


	return (
		<div className="App">
			<Header setPlayerData={setPlayerData}/>
			<div className="container">
				{
					JSON.stringify(playerData) != '{}'
						?
						<>
							<img width="100" height="100" src={"https://ddragon.leagueoflegends.com/cdn/12.21.1/img/profileicon/"+playerData.profileIconId+".png"}></img>
							<p>{playerData.name}</p>
							<p>Level : {playerData.summonerLevel}</p>
						</>
						:
						<>
							<p> player data not found </p>
						</>
				}
			</div>
		</div>

	);
}

export default Content;

import React, { useState } from 'react';
import axios from 'axios';
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	FormControl,
	Grid,
	InputLabel,
	MenuItem, Paper, styled,
	TextField,
	Typography, useTheme
} from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';

function PlayerDatas() {
	const [region, setRegion] = useState('');
	const [searchText, setSearchText] = useState("");
	const [playerData, setPlayerData] = useState({});
	const [playerDetailsData, setPlayerDetailsData] = useState({});
	const API_KEY = "RGAPI-6bdc116a-eca0-497f-ab0e-0c5892fd2502";

	const handleChange = (event: SelectChangeEvent) => {
		setRegion(event.target.value);
	};

	function searchForPlayer(event, region) {
		// On setup l'appel API
		var APICallString = "https://"+region+".api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ searchText + "?api_key="+ API_KEY;
		// On gère l'appel
		axios.get(APICallString).then(function(response) {
			// Success
			setPlayerData(response.data);
			getPlayerDetailsById(response.data.id);
		}).catch(function(error){
			setPlayerData({});
		})
	}

	function getPlayerDetailsById(summonerId) {
		var APICallString = "https://"+region+".api.riotgames.com/lol/league/v4/entries/by-summoner/"+ summonerId + "?api_key="+ API_KEY;
		// On gère l'appel
		axios.get(APICallString).then(function(response) {
			// Success
			setPlayerDetailsData(response.data);
		}).catch(function(error){
			setPlayerDetailsData({});
		})
	}

	console.log(playerDetailsData);

	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	}));

	return (
		<Grid container className="PlayerDatas">
			<Grid item xs={12} className="searchbar-container">
				<FormControl sx={{ m: 1, minWidth: 120 }}>
					<InputLabel id="select_region_label">Région</InputLabel>
					<Select
						labelId="select_region_label"
						id="select_region"
						value={region}
						onChange={handleChange}
						label="Région"
					>
						<MenuItem value={"br1"}>BR</MenuItem>
						<MenuItem value={"eun1"}>EUN</MenuItem>
						<MenuItem value={"euw1"}>EUW</MenuItem>
						<MenuItem value={"jp1"}>JP</MenuItem>
						<MenuItem value={"kr"}>KR</MenuItem>
						<MenuItem value={"la1"}>LA1</MenuItem>
						<MenuItem value={"la2"}>LA2</MenuItem>
						<MenuItem value={"na1"}>NA</MenuItem>
						<MenuItem value={"oc1"}>OC</MenuItem>
						<MenuItem value={"tr1"}>TR</MenuItem>
						<MenuItem value={"ru1"}>RU</MenuItem>
					</Select>
				</FormControl>
				<FormControl sx={{ m: 1, minWidth: 120 }}>
					<TextField id="standard-basic" label="Standard" variant="standard" onChange={e => setSearchText(e.target.value)} onKeyDown={e => e.key === 'Enter' ? searchForPlayer(e, region) : null}/>
				</FormControl>


			</Grid>
			<Grid item xs={12} className="results">
				{
					JSON.stringify(playerData) != '{}'
						?
						<>

							<Card sx={{ display: 'flex' }}>
								<CardMedia
									component="img"
									sx={{ width: 100 }}
									image={"https://ddragon.leagueoflegends.com/cdn/12.21.1/img/profileicon/"+playerData.profileIconId+".png"}
								/>
								<Box sx={{ display: 'flex', flexDirection: 'column' }}>
									<CardContent sx={{ flex: '1 0 auto' }}>
										<Typography component="div" variant="h5">
											{playerData.name}
										</Typography>
										<Typography variant="subtitle1" color="text.secondary" component="div">
											Level : {playerData.summonerLevel}
										</Typography>
									</CardContent>
								</Box>
								<Box sx={{ display: 'flex', flexDirection: 'column' }}>
									{ playerDetailsData.map(function(detail) { return <CardContent><Typography component="div" variant="h5"> {detail.queueType} </Typography><Typography variant="subtitle1" color="text.secondary" component="div"> Rank : {detail.tier} {detail.rank} </Typography></CardContent>; }) }
								</Box>
							</Card>
						</>
						:
						<>
							<p> player data not found </p>
						</>
				}
			</Grid>
		</Grid>
	);
}

export default PlayerDatas;

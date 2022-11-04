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
	List,
	ListItem,
	MenuItem, Paper, styled,
	TextField,
	Typography
} from "@mui/material";
import { Star } from '@mui/icons-material';
import Select from '@mui/material/Select';

function PlayerDatas() {
	
	const [platform, setPlatform] = useState('');
	const [region, setRegion] = useState('');
	const [searchText, setSearchText] = useState("");
	const [playerData, setPlayerData] = useState({});
	const [playerDetailsData, setPlayerDetailsData] = useState({});
	const [playerMatchHistory, setPlayerMatchHistory] = useState({});
	const API_KEY = "RGAPI-6bdc116a-eca0-497f-ab0e-0c5892fd2502";

	const handleChange = (event) => {
		setPlatform(event.target.value);
		const europe = ['euw1', 'eun1', 'tr1', 'ru1'];
		const america = ['na1', 'br1', 'la1', 'la2'];
		const asia = ['jp1', 'kr1'];
		const sea = ['oc1'];


		if (europe.includes(event.target.value)) {
			setRegion('europe');
		} else if (america.includes(event.target.value)) {
			setRegion('america');
		} else if (asia.includes(event.target.value)) {
			setRegion('asia');
		} else if (sea.includes(event.target.value)) {
			setRegion('sea');
		}
		
	};

	function searchForPlayer(event, platform) {
		// On setup l'appel API
		var APICallString = "https://"+platform+".api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ searchText + "?api_key="+ API_KEY;
		// On gère l'appel
		axios.get(APICallString).then(function(response) {
			// Success
			setPlayerData(response.data);
			getPlayerDetailsById(response.data.id);
			getPlayerHistoryById(response.data.puuid)
		}).catch(function(error){
			setPlayerData({});
		})
	}

	function getPlayerDetailsById(summonerId) {
		var APICallString = "https://"+platform+".api.riotgames.com/lol/league/v4/entries/by-summoner/"+ summonerId + "?api_key="+ API_KEY;
		// On gère l'appel
		axios.get(APICallString).then(function(response) {
			// Success
			setPlayerDetailsData(response.data);
		}).catch(function(error){
			setPlayerDetailsData({});
		})
	}


	function getPlayerHistoryById(puuId) {

		var APICallString = "https://"+region+".api.riotgames.com/lol/match/v5/matches/by-puuid/"+ puuId + "/ids?api_key="+ API_KEY;
		// On gère l'appel
		axios.get(APICallString).then(function(response) {
			// Success
			getMultipleMatch(response.data);
		}).catch(function(error){
			
		})
	}

	function getMultipleMatch(matchIdList) {

		let matchs = [];
		let promises = [];
		for (var i = 0; i < matchIdList.length; i++) {
			promises.push(
				axios.get("https://"+region+".api.riotgames.com/lol/match/v5/matches/"+ matchIdList[i] + "?api_key="+ API_KEY).then(response => {
				// do something with response
					matchs.push(response.data.info);
				}).catch(function(error){
					matchs.push({});
				})
			)
		}

		Promise.all(promises).then(() => setPlayerMatchHistory(matchs));
	
	}

	

	console.log(playerData);
	console.log(playerMatchHistory);

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
						value={platform}
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
					<TextField id="standard-basic" label="Nom d'invocateur" variant="standard" onChange={e => setSearchText(e.target.value)} onKeyDown={e => e.key === 'Enter' ? searchForPlayer(e, platform) : null}/>
				</FormControl>


			</Grid>
			<Grid item xs={12} className="results">
				<Item>
					{
						JSON.stringify(playerData) !== '{}'
							?
							<>

								<Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
									
									{ JSON.stringify(playerDetailsData) !== '{}' ?  
										playerDetailsData.map(function(detail) { 
											return  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
														<CardContent>
															<Typography component="div" variant="h5"> {detail.queueType} </Typography>
															<Typography variant="subtitle1" color="text.secondary" component="div"> 
																{detail.tier} {detail.rank} 
															</Typography>
															<Typography variant="subtitle2" component="div"> 
																{detail.leaguePoints}LP | ({detail.wins}W - {detail.losses}L)
															</Typography>
														</CardContent>
													</Box>; 
											}) 
										: 
											null 
									}
									
								</Card>

								
							</>
							:
							<>
								<p> player data not found </p>
							</>
					}
				</Item>
				<Item>
					
					{ JSON.stringify(playerMatchHistory) !== '{}' ?  

						
							playerMatchHistory.map((match) => {
								if (JSON.stringify(match) !== '{}') {
									console.log(match);

									
									return <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>  
												
													{ match.teams.map((team) => {
														console.log(team)
														return  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
																	<CardContent sx={{ flex: '1 0 auto' }}>
																		<Typography component="div" variant="h5"> {team.win == true ? 'Victoire' : 'Défaite'} </Typography>
																	</CardContent>
																	<List>
																			{ match.participants.map((participant)=> {
																				if (participant.teamId == team.teamId) {
																					if (participant.summonerId == playerData.id) {
																						return <ListItem><Star />{participant.summonerName} ({participant.kills}/{participant.deaths}/{participant.assists}) </ListItem>
																					} else {
																						return <ListItem>{participant.summonerName} ({participant.kills}/{participant.deaths}/{participant.assists})</ListItem>
																					}
																				}
																			})}
																	</List>
																		
																</Box>
													}) }
													
												
											</Card>; 
								
								
									
									
								}
							}) 
								
							
						: 
							console.log('null') 
					}
							
						
						
					
				</Item>
			</Grid>
		</Grid>
	);
}

export default PlayerDatas;

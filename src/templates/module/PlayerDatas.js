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
	MenuItem, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	TextField,
	Typography
} from "@mui/material";
import Select from '@mui/material/Select';
import ItemsPopover from "../component/ItemsPopover";

function PlayerDatas() {

	const [platform, setPlatform] = useState('');
	const [region, setRegion] = useState('');
	const [searchText, setSearchText] = useState("");
	const [playerData, setPlayerData] = useState({});
	const [playerDetailsData, setPlayerDetailsData] = useState({});
	const [playerMatchHistory, setPlayerMatchHistory] = useState({});
	const API_KEY = "RGAPI-d2c0fb50-2747-49fe-abb0-260a523f65b8";

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
		<Grid container className="PlayerDatas" spacing={5}>
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
			<Grid item xs={3}>
				<Item>
					{
						JSON.stringify(playerData) !== '{}'
							&&
							<Card>
							<CardMedia
								component="img"
								sx={{ height: 200 }}
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
												<CardMedia
													component="img"
													sx={{ width: 100, margin: 'auto' }}
													image={"/ranked-emblems/Emblem_"+detail.tier+".png"}
												/>
												<CardContent>
													<Typography component="div" variant="h5"> {detail.queueType == 'RANKED_SOLO_5x5' ? 'Solo/Duo' : 'Flex'} </Typography>
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
					}
				</Item>
			</Grid>
			<Grid item xs={9}>
				<Item>

					{ JSON.stringify(playerMatchHistory) !== '{}' &&

						playerMatchHistory.map((match) => {
							if (JSON.stringify(match) !== '{}') {

								return <Card sx={{ display: 'flex', marginBottom: '20px'}}>
									{ match.teams.map((team, index) => {
										return <TableContainer sx={{ width: '50%'}} style={index == 1 ? {direction: 'rtl'} : {}}>
												<Table sx={{ minWidth: 650 }} aria-label="simple table">
													<TableHead>
														<TableRow>
															<TableCell>Nom d'invocateur</TableCell>
															<TableCell align="center">
																<img alt="champion icon" style={{maxHeight: '30px'}} src="https://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/champion.png"></img>
															</TableCell>
															<TableCell align="center">
																<img alt="KDA" style={{maxHeight: '30px'}} src="https://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/items.png"></img>
															</TableCell>
															<TableCell align="center">
																<img alt="KDA" style={{maxHeight: '30px'}} src="https://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/score.png"></img>
															</TableCell>

															<TableCell align="center">
																<img alt="KDA" style={{maxHeight: '30px'}} src="https://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/minion.png"></img>
															</TableCell>
															<TableCell align="center">
																<img alt="KDA" style={{maxHeight: '30px'}} src="https://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/gold.png"></img>
															</TableCell>
														</TableRow>
													</TableHead>
													<TableBody style={team.win == false ? {background: 'rgba(255,75,75,0.5)'} : {background: 'rgba(75,240,255,0.5)'}}>

														{ match.participants.map((participant) => {

															if (participant.teamId === team.teamId) {
																return <TableRow
																	style={participant.summonerId === playerData.id ? {background: 'rgba(255,205,75,0.5)'} : {background: 'none'}}
																	key={participant.summonerId}
																	sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
																>

																	<TableCell component="th" scope="row">
																		{participant.summonerName}
																	</TableCell>
																	<TableCell align="center">
																		<img style={{maxHeight: '30px'}} alt={participant.championName} src={"http://ddragon.leagueoflegends.com/cdn/12.21.1/img/champion/"+participant.championName+".png"} />
																	</TableCell>
																	<TableCell align="center">
																		<ItemsPopover item={participant.item0}/>
																		<ItemsPopover item={participant.item1}/>
																		<ItemsPopover item={participant.item2}/>
																		<ItemsPopover item={participant.item3}/>
																		<ItemsPopover item={participant.item4}/>
																		<ItemsPopover item={participant.item5}/>
																	</TableCell>
																	<TableCell align="center">{participant.kills}/{participant.deaths}/{participant.assists}</TableCell>
																	<TableCell align="center">{participant.totalMinionsKilled + participant.neutralMinionsKilled}</TableCell>
																	<TableCell align="center">{Math.round((participant.goldEarned / 1000) * 10) / 10  + 'k'}</TableCell>
																</TableRow>

															}
														})}
													</TableBody>
												</Table>
											</TableContainer>


									}) }


								</Card>;

							}
						})
					}
				</Item>
			</Grid>
		</Grid>
	);
}

export default PlayerDatas;

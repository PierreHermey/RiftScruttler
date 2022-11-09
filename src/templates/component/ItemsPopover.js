import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from "axios";

export default function ItemsPopover(itemId) {
	const allItems = [];
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const item = itemId.item;

	return (
		<>
			{ item !== 0 ?
				<img style={{maxHeight: '30px', border: '1px solid rgba(12, 12, 12, .5)'}} alt={item} src={"http://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/" + item + ".png"} aria-describedby={id}  onClick={handleClick}/>
				:
				<span style={{
					display: 'inline-block',
					height: '30px',
					width: '30px',
					border: '1px solid rgba(12, 12, 12, .5)'
				}}></span>
			}

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<Typography sx={{ p: 2 }}>
					{/*	!TODO Ajouter Items Details*/}
				</Typography>
			</Popover>
		</>
	);
}

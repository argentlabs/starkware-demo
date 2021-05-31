import React, { useCallback, useContext } from 'react';
import { Box, Button, Dialog, Grid, makeStyles, styled, Typography } from '@material-ui/core';
import { ActionTypes, NotificationsContext } from 'context/notifications';
import { TokenIcon } from './common/TokenIcon';
import { ExternalLink } from './common/ExternalLink';

const StyledContainer = styled(Box)({
	maxWidth: '100%',
	width: 434,
	minHeight: 359,
	maxHeight: '100%',
	'& > *': {
		height: '100%',
	},
	padding: 32,
	boxSizing: 'border-box',
});

const StyledIconContainer = styled(Box)({
	width: '100%',

	'& > *': {
		margin: 'auto',
	},
});

const StyledTitle = styled(Typography)({
	textAlign: 'center',
	padding: '0 32px 32px 32px',
});

const StyledText = styled(Typography)({
	textAlign: 'center',
	padding: 22,
});

const StyledLink = styled(ExternalLink)({
	margin: 'auto',
	textAlign: 'center',
	paddingBottom: 35,
	display: 'block',
});

const useStyles = makeStyles({
	dialog: {
		top: 100,
	},
	scrollPaper: {
		alignItems: 'baseline',
	},
});

export const SuccessDialog: React.FC = () => {
	const {
		state: { success },
		dispatch,
	} = useContext(NotificationsContext);
	const classes = useStyles();

	const handleClose = useCallback(() => {
		dispatch({
			type: ActionTypes.CLOSE_SUCCESS,
		});
	}, [dispatch]);

	return (
		<Dialog
			open={success.open}
			onClose={handleClose}
			classes={{
				paper: classes.dialog,
				scrollPaper: classes.scrollPaper,
			}}
		>
			<StyledContainer>
				<Grid container justify="space-between" direction="column">
					<Grid item>
						<StyledTitle variant="h4" color="textPrimary">
							{success.title}
						</StyledTitle>
						<StyledIconContainer>
							<TokenIcon icon={success.icon} size="large" />
						</StyledIconContainer>
						<StyledText variant="body2" color="textPrimary">
							{success.text}
						</StyledText>
						<StyledLink
							variant="subtitle1"
							color="secondary"
							href="https://etherscan.io/"
							target="_blank"
							rel="noreferrer"
						>
							{success.link}
						</StyledLink>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							color="secondary"
							fullWidth
							disableElevation
							onClick={handleClose}
						>
							{success.buttonText}
						</Button>
					</Grid>
				</Grid>
			</StyledContainer>
		</Dialog>
	);
};

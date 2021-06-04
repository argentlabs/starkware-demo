import React, { useContext, useState } from 'react';
import { Button, Grid, styled, Typography } from '@material-ui/core';

import { ActionTypes, NotificationsContext } from 'context/notifications';
import { Token } from '../models/token';
import { DarkBox } from './common/DarkBox';
import { SelectedToken, TokenSelector } from './TokenSelector';
import { NumericInput } from './NumericInput';
import { useTokens } from 'services/API/token/hooks/useTokens';
import { useTokenOptions } from '../services/API/token/hooks/useTokenOptions';
import { useMintError } from '../hooks/amounts';
import { BouncingDots } from './common/BouncingDots';

const StyledInputContainer = styled(Grid)(({ theme }) => ({
	[theme.breakpoints.up('sm')]: {
		paddingLeft: 12,
	},
}));

const StyledContainer = styled(Grid)({
	'& > *': {
		marginBottom: '25.5px',
	},
});

const StyledAddButtonContainer = styled(Grid)({
	'& > *': {
		marginBottom: '10px',
	},
	textAlign: 'center',
});

const StyledAddTokenButton = styled(Button)(({ theme }) => ({
	fontSize: theme.spacing(2),
}));

const StyledLoadingContainer = styled(Grid)({
	height: 236,
	textAlign: 'center',
});

const StyledBouncingDots = styled(BouncingDots)({
	marginBottom: 40,
});

export const Mint = (): JSX.Element => {
	const { dispatch } = useContext(NotificationsContext);
	const [loading, setLoading] = useState(false);
	const [mintToken1, setMintToken1] = useState<Token>();
	const [mintToken2, setMintToken2] = useState<Token>();
	const [mintAmount1, setMintAmount1] = useState<string>('1');
	const [mintAmount2, setMintAmount2] = useState<string>('1000');

	const { data: tokenOptions } = useTokens();
	const options = useTokenOptions(mintToken1, tokenOptions);
	const mint1Error = useMintError(mintToken1, mintAmount1);
	const mint2Error = useMintError(mintToken2, mintAmount2);
	const error = mint1Error || (mintToken2 && mint2Error);

	const handleAddToken = () => {
		if (!options) return;
		setMintToken2(options[0]);
	};

	const handleMint = () => {
		if (!mintToken1) return;
		setLoading(true);
		setTimeout(() => {
			if (!mintToken2) {
				dispatch({
					type: ActionTypes.OPEN_SUCCESS,
					payload: {
						title: `Success!`,
						icon: mintToken1.icon,
						text: `Received ${mintAmount1} ${mintToken1.symbol}`,
						link: '0xb7d91c4........fa84fc5e6f',
						buttonText: 'Go Back',
					},
				});
			} else {
				dispatch({
					type: ActionTypes.OPEN_MULTI_TOKEN_SUCCESS,
					payload: {
						title: `Success!`,
						icons: [mintToken1.icon, mintToken2.icon],
						text: `Minted ${mintAmount1} ${mintToken1.symbol} & ${mintAmount2} ${mintToken2.symbol}`,
						links: ['0xb7d91c4........fa84fc5e6f', '0xb7d91c4........fa84fc5e6f'],
						buttonText: 'Go Back',
					},
				});
			}

			setLoading(false);
		}, 3000);
	};

	const MintToken1 = () => {
		if (mintToken1 && mintToken2) {
			return <SelectedToken token={mintToken1} />;
		}

		return (
			<TokenSelector
				value={mintToken1}
				options={options}
				onChange={(token) => setMintToken1(token)}
			/>
		);
	};

	if (loading) {
		return (
			<StyledLoadingContainer container alignItems="center" justify="center">
				<Grid item>
					<StyledBouncingDots />
					<Typography color="textPrimary">Loading, Please wait</Typography>
				</Grid>
			</StyledLoadingContainer>
		);
	}

	return (
		<Grid container>
			<StyledContainer item xs={12}>
				<DarkBox>
					<Grid container alignItems="center">
						<Grid item xs aria-label="token to swap">
							<MintToken1 />
						</Grid>
						{mintToken1 && (
							<StyledInputContainer item xs={4} sm={6} alignItems="center">
								<Grid item xs>
									<NumericInput
										inputProps={{
											'aria-label': 'amount of token to swap',
										}}
										value={mintAmount1}
										handleChange={(change) => setMintAmount1(change)}
									/>
								</Grid>
							</StyledInputContainer>
						)}
					</Grid>
				</DarkBox>
			</StyledContainer>
			{mintToken2 && (
				<StyledContainer item xs={12}>
					<DarkBox>
						<Grid container alignItems="center">
							<Grid item xs aria-label="token to swap">
								<SelectedToken token={mintToken2} />
							</Grid>
							<StyledInputContainer item xs={4} sm={6} alignItems="center">
								<Grid item>
									<NumericInput
										inputProps={{
											'aria-label': 'amount of token to swap',
										}}
										value={mintAmount2}
										handleChange={(change) => setMintAmount2(change)}
									/>
								</Grid>
							</StyledInputContainer>
						</Grid>
					</DarkBox>
				</StyledContainer>
			)}
			{mintToken1 && !mintToken2 && (
				<StyledAddButtonContainer item xs={12}>
					<StyledAddTokenButton color="secondary" onClick={handleAddToken}>
						+ Add Token
					</StyledAddTokenButton>
				</StyledAddButtonContainer>
			)}
			<Grid item xs={12}>
				<Button
					variant="contained"
					color="secondary"
					fullWidth
					disableElevation
					disabled={(!mintAmount1 && !mintAmount2) || !!error}
					onClick={handleMint}
				>
					{error ? error : 'Mint'}
				</Button>
			</Grid>
		</Grid>
	);
};

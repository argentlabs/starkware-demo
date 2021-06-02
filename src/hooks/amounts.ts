import { ConversionRate, Token } from 'models/token';
import { getConversionRate } from '../utils/rates';

export const useConversionError = (
	token?: Token,
	amount?: string,
	limit?: string,
): string | undefined => {
	if (!token) return 'Select a token';
	if (!amount) return 'Enter an amount';
	if (Number(amount) === 0) return 'Enter an amount';

	// TODO: implement big number once we have the API
	if (limit && Number(amount) > Number(limit)) {
		return `Insufficient ${token.symbol}`;
	}

	return undefined;
};

export const useConversionRates = (fromToken?: Token, toToken?: Token): ConversionRate => {
	if (!fromToken || !toToken) {
		return { from: 1, to: 1 };
	}

	// TODO: implement big number once we have the API
	return getConversionRate(fromToken.price, toToken.price);
};

export const useMintError = (token?: Token, amount?: string): string | undefined => {
	if (!token) return 'Select a token';
	if (!amount) return 'Enter an amount';
	if (Number(amount) === 0) return 'Enter an amount';
	if (Number(amount) > 1000) {
		return `You can mint up to 1000 ${token.symbol}`;
	}

	return undefined;
};

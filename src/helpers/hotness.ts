const SCHPOOP_EPOCH = 1543622400;

export default (votes: number, postDate: Date): number => {
	const order = Math.log10(Math.max(Math.abs(votes), 1));
	const sign = votes === 0 ? 0 : votes > 0 ? 1 : -1;
	const seconds = postDate.valueOf() / 1000 - SCHPOOP_EPOCH;
	return (
		Math.round(Math.pow(10, 7) * (sign * order + seconds / 45000)) /
		Math.pow(10, 7)
	);
};

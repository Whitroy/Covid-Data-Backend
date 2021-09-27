export const sanitizeObj = (obj: { [key: string]: any }) => {
	const newObj = Object.keys(obj).reduce((prev: any, curr) => {
		if (obj[curr] === "" || !obj[curr] || obj[curr].length === 0) return prev;
		return { ...prev, [curr]: obj[curr] };
	}, {});
	return newObj;
};

export const parseIntoNum = (val: any) => {
	if (val) {
		return +val;
	}
};

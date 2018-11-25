import { Like } from "typeorm";

export default (
	// tslint:disable-next-line:no-any
	query: any,
	queries: ReadonlyArray<string>,
	isSearch?: ReadonlyArray<string>
) => {
	return queries.reduce(
		(obj, current) => {
			if (query[current]) {
				obj[current] =
					isSearch && isSearch.some(search => search === current)
						? Like(`%${query[current]}%`)
						: query[current];
			}
			return obj;
		},
		// tslint:disable-next-line:no-any
		{} as any
	);
};

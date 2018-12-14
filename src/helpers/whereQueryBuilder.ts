import { Like } from "typeorm";

/**
 * Helper function to build object containing matches used in where selections.
 * Builds the object from possible parameters, useful for many optional query parameters.
 * @param query Query object containing possible queries from a request (given in querystring)
 * @param queries A list of queries that should be possible to to match against.
 * @param isSearch Specifies which ones of the parameters in the 'queries' parameter should
 * be searched against, not matched 100%.
 */
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

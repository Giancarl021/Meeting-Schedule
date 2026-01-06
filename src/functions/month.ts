import {
    app,
    type HttpRequest,
    type HttpResponseInit,
    type InvocationContext
} from '@azure/functions';
import FileSearch, { type FileSearchResult } from '../services/FileSearch';
import FileParser, { type ParsedFiles } from '../services/FileParser';

export async function month(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const { month, year } = request.params;
    context.log(
        `Http function processed request for url "${request.url}" with params: ${JSON.stringify({ month, year })}`
    );

    let searchResult: FileSearchResult;
    let parsedFiles: ParsedFiles;

    const fileSearch = FileSearch(context);
    const fileParser = FileParser(context);

    try {
        searchResult = await fileSearch.search(Number(year), Number(month));
    } catch (err) {
        context.error(err);
        const _err = err instanceof Error ? err : new Error(String(err));
        return {
            status: 500,
            jsonBody: {
                error: `Failed to get JWPUB file for month = ${month}, year = ${year}`,
                innerError: {
                    message: _err.message,
                    stack: _err.stack,
                    name: _err.name
                }
            }
        };
    }

    try {
        parsedFiles = await fileParser.parse(searchResult);
    } catch (err) {
        context.error(err);
        const _err = err instanceof Error ? err : new Error(String(err));
        return {
            status: 500,
            jsonBody: {
                error: `Failed to parse JWPUB files for month = ${month}, year = ${year}`,
                innerError: {
                    message: _err.message,
                    stack: _err.stack,
                    name: _err.name
                }
            }
        };
    }

    return { jsonBody: parsedFiles };
}

app.http('month', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'month/{year:int}/{month:int}',
    handler: month
});

import {
    app,
    type HttpRequest,
    type HttpResponseInit,
    type InvocationContext
} from '@azure/functions';
import FileSearch, { type FileSearchResult } from '../services/FileSearch';
import FileParser, { type ParsedFiles } from '../services/FileParser';
import DataTransformer, { type MeetingData } from '../services/DataTransformer';
import ErrorResponse from '../util/ErrorResponse';
import formatDate from '../util/formatDate';

export async function schedule(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const { month, year } = request.params;
    context.log(
        `Http function processed request for url "${request.url}" with params: ${JSON.stringify({ month, year })}`
    );

    let searchResult: FileSearchResult;
    let parsedFiles: ParsedFiles;
    let meetingsData: MeetingData[];

    const errorResponse = ErrorResponse(context);
    const fileSearch = FileSearch(context);
    const fileParser = FileParser(context);
    const dataTransformer = DataTransformer(context);

    try {
        searchResult = await fileSearch.search(Number(year), Number(month));
    } catch (error) {
        return errorResponse.fromError(
            error,
            `Failed to get JWPUB file for month = ${month}, year = ${year}`
        );
    }

    try {
        parsedFiles = await fileParser.parse(searchResult);
    } catch (error) {
        return errorResponse.fromError(
            error,
            `Failed to parse JWPUB files for month = ${month}, year = ${year}`
        );
    }

    try {
        meetingsData = dataTransformer.transform(parsedFiles);
    } catch (error) {
        return errorResponse.fromError(
            error,
            `Failed to transform JWPUB files for month = ${month}, year = ${year}`
        );
    }

    return {
        jsonBody: meetingsData.map(e => ({
            ...e,
            startDate: formatDate(e.startDate),
            endDate: formatDate(e.endDate)
        }))
    };
}

app.http('schedule', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'schedule/{year:int}/{month:int}',
    handler: schedule
});

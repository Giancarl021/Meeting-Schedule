import type { HttpResponseInit } from '@azure/functions';
import type Logger from '../interface/Logger';

export default function ErrorResponse(logger: Logger) {
    function fromError(error: unknown, message: string): HttpResponseInit {
        logger.error(error);
        const err = error instanceof Error ? error : new Error(String(error));
        return {
            status: 500,
            jsonBody: {
                error: message,
                innerError: {
                    message: err.message,
                    stack: err.stack,
                    name: err.name
                }
            }
        };
    }

    return { fromError };
}

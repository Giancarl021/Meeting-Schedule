import type { InvocationContext } from '@azure/functions';

type Logger = Pick<
    InvocationContext,
    'log' | 'warn' | 'error' | 'debug' | 'trace'
>;

export default Logger;

import constants from './constants';

export interface Period {
    year: string;
    month: string;
}

export default function getPeriod(
    year: number,
    month: number,
    delta: number = 0
) {
    const d = new Date(year, month - 1);
    d.setMonth(d.getMonth() + delta);

    let y = d.getFullYear();
    let m = d.getMonth() + 1;

    const _m = constants.monthMap[m];

    if (!_m) {
        throw new Error(`Invalid month: ${m}`);
    }

    return {
        year: String(y),
        month: _m
    };
}

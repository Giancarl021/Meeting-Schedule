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
    let y = year;
    let m = month;

    if (month + delta < 1) {
        y -= 1;
        m = 12 + (month + delta);
    } else if (month + delta > 12) {
        y += 1;
        m = (month + delta) % 12;
    }

    const _m = constants.monthMap[m];

    if (!_m) {
        throw new Error(`Invalid month: ${m}`);
    }

    return {
        year: String(y),
        month: _m
    };
}

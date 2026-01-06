import { loadPub } from 'meeting-schedules-parser';
import type Logger from '../interface/Logger';
import type { FileSearchResult } from './FileSearch';

type AyfFields =
    | `mwb_ayf_part${number}`
    | `mwb_ayf_part${number}_time`
    | `mwb_ayf_part${number}_type`
    | `mwb_ayf_part${number}_title`;

type LcFields =
    | `mwb_lc_part${number}`
    | `mwb_lc_part${number}_time`
    | `mwb_lc_part${number}_title`
    | `mwb_lc_part${number}_content`;

type DynamicFields = {
    [K in AyfFields]?: K extends `${string}_time` ? number : string;
} & {
    [K in LcFields]?: K extends `${string}_time` ? number : string;
};

export interface ParsedMidweekEntry extends DynamicFields {
    mwb_week_date: string;
    mwb_week_date_locale: string;
    mwb_weekly_bible_reading: string;
    mwb_song_first: number;
    mwb_tgw_talk: string;
    mwb_tgw_talk_title: string;
    mwb_tgw_gems_title: string;
    mwb_tgw_bread: string;
    mwb_tgw_bread_title: string;
    mwb_ayf_count: number;
    mwb_song_middle: number;
    mwb_lc_count: number;
    mwb_lc_cbs: string;
    mwb_lc_cbs_title: string;
    mwb_song_conclude: number;
}

export interface ParsedWeekendEntry {
    w_study_date: string;
    w_study_date_locale: string;
    w_study_title: string;
    w_study_opening_song: number;
    w_study_concluding_song: number;
}

export interface ParsedFiles {
    midweek: ParsedMidweekEntry[];
    weekend: ParsedWeekendEntry[];
}

export default function FileParser(logger: Logger) {
    async function parse(searchResult: FileSearchResult): Promise<ParsedFiles> {
        logger.log(
            `Parsing files: Midweek = ${searchResult.midweekUrl}, Weekend = ${searchResult.weekendUrl}`
        );

        const [midweek, weekend] = await Promise.all([
            loadPub({ url: searchResult.midweekUrl }),
            loadPub({ url: searchResult.weekendUrl })
        ]);

        logger.log(`Successfully parsed files`);

        return { midweek, weekend };
    }

    return {
        parse
    };
}

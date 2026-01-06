import constants from '../util/constants';
import type Logger from '../interfaces/Logger';
import type { ParsedFiles } from './FileParser';

export interface MeetingPart {
    title: string;
    durationMinutes: number;
    talk?: true;
}

export interface MeetingData {
    startDate: Date;
    endDate: Date;
    midweek: {
        songs: [number, number, number];
        talkTitle: string;
        bibleReadingDurationMinutes: number;
        applyYourselfToTheFieldMinistry: MeetingPart[];
        livingAsChristians: MeetingPart[];
    };
    weekend: {
        watchtowerTitle: string;
        songs: [number, number];
    };
}

type DataBlock = {
    [key in keyof ParsedFiles]: ParsedFiles[key][number];
};

export default function DataTransformer(logger: Logger) {
    function _extractParts(
        data: DataBlock[keyof DataBlock],
        type: 'ayf' | 'lc'
    ): MeetingPart[] {
        const prefix = `mwb_${type}_part`;

        const keys = Object.keys(data).filter(key => key.startsWith(prefix));

        const blocks = keys.filter(key => /^mwb_(ayf|lc)_part\d{1}$/.test(key));

        return blocks
            .map(block => ({
                title: data[block + '_title'],
                durationMinutes: data[block + '_time'],
                talk: (type === 'ayf' &&
                data[block + '_title']
                    ?.trim()
                    .toLowerCase()
                    .includes(constants.talkKey)
                    ? true
                    : undefined) as true | undefined
            }))
            .filter(block => block.title && block.durationMinutes);
    }

    function transform(data: ParsedFiles): MeetingData[] {
        const blocks: DataBlock[] = [];

        for (const weekend of data.weekend) {
            const midweek = data.midweek.find(
                m => m.mwb_week_date === weekend.w_study_date
            );

            if (!midweek) continue;

            blocks.push({
                weekend,
                midweek
            });
        }

        logger.log(`Created ${blocks.length} blocks`);

        return blocks.map(block => {
            const startDate = new Date(block.midweek.mwb_week_date);
            const endDate = new Date(block.midweek.mwb_week_date);

            endDate.setDate(endDate.getDate() + 6);

            const ayfParts = _extractParts(block.midweek, 'ayf');

            const timeUntilNow = ayfParts
                .map(part => part.durationMinutes + 1)
                .reduce((acc, i) => acc + i, 0);
            const bibleReadingDurationMinutes =
                timeUntilNow > 0 ? 20 - timeUntilNow - 1 : 4;

            return {
                startDate,
                endDate,
                midweek: {
                    bibleReadingDurationMinutes,
                    applyYourselfToTheFieldMinistry: ayfParts,
                    talkTitle: block.midweek.mwb_tgw_talk_title,
                    livingAsChristians: _extractParts(block.midweek, 'lc'),
                    songs: [
                        block.midweek.mwb_song_first,
                        block.midweek.mwb_song_middle,
                        block.midweek.mwb_song_conclude
                    ]
                },
                weekend: {
                    watchtowerTitle: block.weekend.w_study_title,
                    songs: [
                        block.weekend.w_study_opening_song,
                        block.weekend.w_study_concluding_song
                    ]
                }
            } as MeetingData;
        });
    }

    return {
        transform
    };
}

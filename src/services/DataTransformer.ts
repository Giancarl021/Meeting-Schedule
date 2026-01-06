import type Logger from '../interface/Logger';

export interface MeetingPart {
    title: string;
    durationMinutes: number;
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

export default function DataTransformer(logger: Logger) {
    function transform(data: any): MeetingData[] {
        return [];
    }

    return {
        transform
    };
}

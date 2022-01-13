export interface LogTime {
    subjectId: number,
    tagId: number | null,
    timeStart: Date,
    timeEnd: Date,
    totalSeconds: number
}


export interface LogTimeModel {
    id: number;
    subject_id: number;
    tag_id?: any;
    time_start: Date;
    time_end: Date;
    subject_name: string;
    tag_name: string;
    total_seconds: number;
    created_at: Date;
    updated_at: Date;
}


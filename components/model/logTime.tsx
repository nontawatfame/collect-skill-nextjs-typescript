export interface LogTime {
    subjectId: number,
    tagId: number | null,
    timeStart: Date,
    timeEnd: Date,
    totalSeconds: number
}
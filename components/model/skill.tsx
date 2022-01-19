export interface SkillRes {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    seconds_total: number;
    exp_next: number;
    level: number;
}

export interface ResLog {
    status: string;
    data: SkillRes[];
}
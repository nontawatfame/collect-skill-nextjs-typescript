export interface SkillRes {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    hours_total: number;
}

export interface SkillPagination {
    data: SkillRes[];
    total_data: number;
    total_pages: number;
}
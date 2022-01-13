import { NextPage } from "next"
import HeadPage from "../components/head-page"
import Paginations, { PaginationData, paginationDefault, DataOnChangePage, processPages, indexData, ResPagination } from "../components/paginations";
import home from "../styles/Home.module.css";
import * as logTimesService from "../service/log-times-service";
import { LogTimeModel } from "../components/model/logTime";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const History: NextPage<{ props: any, response: ResPagination<LogTimeModel> }> = ({ props, response }) => {
    const [dataTime, setDataTime] = useState<ResPagination<LogTimeModel>>(response)
    const [pagination] = useState<PaginationData>({
        ...paginationDefault,
        totalPages: response.total_pages
    })

    const [active, setActive] = useState<number>(1)

    function onChangePage(e: DataOnChangePage) {
        setActive(processPages(e, active, pagination.totalPages))
    }

    const convertFomatTime = (time: Date) => {
        return dayjs(time).format("HH:mm:ss")
    }

    useEffect(() => {
        async function apiTime() {
            let res: ResPagination<LogTimeModel>  = await logTimesService.getLogTimes(active, pagination.size)
            pagination.totalPages = res.total_pages
            setDataTime(res)
        }

        apiTime()
    }, [active, pagination])

    return (
        <div>
            <HeadPage name={'History'}></HeadPage>
            <ul className="list-group mt-4 mb-3">
                {dataTime.data.map((res: LogTimeModel) => {
                    return <li className="list-group-item" key={res.id}>
                        <div className="d-flex flex-row justify-content-between">
                            <div className="d-flex flex-row">
                                <h6><label className={"text-dark " + home.history_day}>{dayjs(res.created_at).format("DD/MM/YYYY")}</label></h6>
                                <h6><label className={"badge bg-light text-dark " + home.history_time}>{convertFomatTime(res.time_start)} {'to'} {convertFomatTime(res.time_end)}</label></h6>
                                <h6><label><span className={"badge bg-primary " + home.history_skill_name}>Skill : </span><span className={"badge bg-primary " + home.history_skill}>{res.subject_name}</span></label></h6>
                                {(res.tag_id != null)
                                    ? <h6><label ><span className={"badge bg-danger " + home.history_tag_name}>Tag :</span><span className={"badge bg-danger " + home.history_tag}>{res.tag_name}</span> </label></h6>
                                    : ""
                                }
                            </div>

                            <div className="d-flex flex-row">
                                <label htmlFor=""><span className={home.history_seconds}>{res.total_seconds}s</span></label>
                            </div>
                        </div>
                    </li>
                })}
            </ul>

            <Paginations active={active} totalPages={pagination.totalPages} onChangePage={(e) => onChangePage(e)} ></Paginations>
        </div>
    )
}

export async function getStaticProps(context: any) {
    const data = await logTimesService.getLogTimes(paginationDefault.page, paginationDefault.size)
    return {
        props: { response: data },
    }
}

export default History
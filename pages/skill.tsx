import { NextPage } from "next"
import { useEffect, useState } from "react";
import { Badge, Button, Modal, Pagination, ProgressBar } from "react-bootstrap"
import HomeCss from '../styles/Home.module.css';
import HeadPage from "../components/head-page"
import Paginations, { PaginationData, paginationDefault, DataOnChangePage, processPages, indexData} from '../components/paginations'
import { SkillPagination, SkillRes } from "../components/model/skill";
import dayjs from "dayjs";

import { getApiSubjects } from "../service/skill-service"

const Skill: NextPage<{ props: string, response: SkillPagination }> = ({ props, response }) => {
    const [dataSkill, setDataSkill] = useState<SkillPagination>(response)
    const [pagination] = useState<PaginationData>({
        ...paginationDefault,
        totalPages: response.total_pages
    })

    const [active, setActive] = useState<number>(1)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id: any) => {
        console.log(id)
        setShow(true);
    }

    const [time, setTime] = useState<{
        [key: string]: string
    }>({
        seconds: "00",
        minutes: "00",
        hours: "00"
    })

    const [isActive, setIsActive] = useState(false);
    const [dateStart, setDateStart] = useState(dayjs());

    async function startTimer() {
        setIsActive(true);
        setDateStart(dayjs())
    }

    function stopTimer() {
        handleClose()
        setIsActive(false);
        setTime({
            seconds: "00",
            minutes: "00",
            hours: "00"
        })
    }

    useEffect(() => {
        let interval: any = null;
        if (isActive == true) {
            interval = setInterval(() => {

                console.log(dateStart.format("DD/MM/YYYY HH:mm:ss"))
                console.log(dayjs().format("DD/MM/YYYY HH:mm:ss"))

                secondsToHms(dayjs().diff(dateStart, "seconds"))


            }, 1000);
        } else if (isActive == false) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [dateStart, isActive]);


    function secondsToHms(d: number) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? (h < 10 ? `0${h}` : `${h}`) : "00";
        var mDisplay = m > 0 ? (m < 10 ? `0${m}` : `${m}`) : "00";
        var sDisplay = s > 0 ? (s < 10 ? `0${s}` : `${s}`) : "00";

        setTime({
            seconds: sDisplay,
            minutes: mDisplay,
            hours: hDisplay
        })
    }

    function onChangePage(e: DataOnChangePage) {
        setActive(processPages(e, active, pagination.totalPages))
    }


    useEffect(() => {

        async function apiSubject() {
            let res: SkillPagination  = await getApiSubjects(active, pagination.size)
            pagination.totalPages = res.total_pages
            setDataSkill(res)
        }

        apiSubject()
    }, [active, pagination])

    return (
        <div>
            <HeadPage name={'Skill'}></HeadPage>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">name</th>
                        <th scope="col">lavel</th>
                        <th scope="col" className="text-center">exp</th>
                        <th scope="col" className="text-center">hours</th>
                        <th scope="col" className="text-center">action</th>
                    </tr>
                </thead>
                <tbody>
                    {dataSkill.data.map((res: SkillRes, i: any) => {
                        return <tr key={res.id}>
                            <th scope="row">{indexData(i, active, pagination.size)}</th>
                            <td>{res.name}</td>
                            <td>2</td>
                            <td >
                                <ProgressBar animated now={60} label={`${60}%`} />
                            </td>
                            <td className="text-center"><Badge bg="primary">{res.hours_total} hours</Badge></td>
                            <td className="text-center">
                                <button className="btn btn-success btn-sm" onClick={() => handleShow(res.id)}>Start</button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
           
            <Paginations active={active} totalPages={pagination.totalPages} onChangePage={(e) => onChangePage(e)} ></Paginations>

                
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                style={{
                    marginTop: '150px'
                }}
                onExit={stopTimer}
            >
                <Modal.Header closeButton >
                    <Modal.Title>Timer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">#Tag</span>
                        <input type="text" className="form-control" disabled={isActive} placeholder="#Tag..." aria-label="Username" aria-describedby="basic-addon1" />
                    </div>

                    <div className={`text-center`}>
                        <h1 className={HomeCss.font_time}>{time.hours}:{time.minutes}:{time.seconds}</h1>
                    </div>
                </Modal.Body>
                <Modal.Footer className={HomeCss.justify_center}>
                    <Button variant={(isActive == true) ? "danger" : "success"} className={HomeCss.btn_with} onClick={(isActive == true) ? stopTimer : startTimer}>
                        {(isActive == true) ? "Stop" : "Start"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export async function getStaticProps(context: any) {
    const data = await getApiSubjects(paginationDefault.page, paginationDefault.size)
    return {
        props: { response: data },
    }
}



export default Skill


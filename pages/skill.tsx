import { NextPage } from "next"
import { useEffect, useRef, useState } from "react";
import { Badge, Button, Modal, Pagination, ProgressBar } from "react-bootstrap"
import HomeCss from '../styles/Home.module.css';
import HeadPage from "../components/head-page"
import Paginations, { PaginationData, paginationDefault, DataOnChangePage, processPages, indexData, ResPagination } from '../components/paginations'
import { SkillRes } from "../components/model/skill";
import dayjs from "dayjs";

import * as skillService from "../service/skill-service"
import { logTimesCreate } from "../service/log-times-service";
import { LogTime } from "../components/model/logTime";
import { useRouter } from "next/router";

const Skill: NextPage<{ props: string, response: ResPagination<SkillRes> }> = ({ props, response }) => {
    const [dataSkill, setDataSkill] = useState<ResPagination<SkillRes>>(response)
    const [pagination] = useState<PaginationData>({
        ...paginationDefault,
        totalPages: response.total_pages
    })
    const router = useRouter()
    console.log(router.query.user)
    let user = router.query.user

    console.log(pagination)

    const [active, setActive] = useState<number>(1)

    const [tag, setTag] = useState<string>("")

    const [idSubject, setIdSubject] = useState<number>(0);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id: any) => {
        setIdSubject(id)
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
    const [dateEnd, setDateEnd] = useState(dayjs());

    const inputTag = useRef<HTMLInputElement>(null)

    const [showDelete, setShowDelete] = useState(false)
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = (id: number) => {
        setIdSubject(id)
        setShowDelete(true)
    }

    const [showAdd, setShowAdd] = useState(false)
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = async (isEdit: boolean, id: number = 0) => {
        if (isEdit == true) {
            const res = await skillService.getSubjectById(id)
            console.log(res)
            setSubjectName(res[0].name)
        } else {
            setSubjectName("")
        }

        setIdSubject(id)
        setIsEdit(isEdit)
        setShowAdd(true)
    }

    const [subjectName, setSubjectName] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);

    const [isEdit, setIsEdit] = useState(true);

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

        let logTimeCreate: LogTime = {
            subjectId: idSubject,
            timeStart: dateStart.toDate(),
            timeEnd: dateEnd.toDate(),
            totalSeconds: Math.sign(dateEnd.diff(dateStart, "seconds")) == -1 ? 0 : dateEnd.diff(dateStart, "seconds"),
            tagId: null
        }
        console.log(tag)

        logTimesCreate(logTimeCreate);
        setTag("")
    }

    useEffect(() => {
        let interval: any = null;
        if (isActive == true) {
            interval = setInterval(() => {
                setDateEnd(dayjs())
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
            let res: ResPagination<SkillRes> = await skillService.getApiSubjects(active, pagination.size)
            pagination.totalPages = res.total_pages
            if (res.data.length == 0) {
                setActive(processPages({ pagination: "prev", page: 0 }, active, pagination.totalPages))
            }
            setDataSkill(res)
        }

        apiSubject()

        return () => {
            setIsUpdate(false)
        }
    }, [active, pagination, isUpdate])

    async function deleteSubject() {
        console.log(idSubject)
        const res = await skillService.deleteById(idSubject)
        if (res.status == 200) {
            handleCloseDelete()
            setIsUpdate(true);
        }
    }

    async function saveSubject() {
        console.log("save")
        console.log(subjectName)
        const res = await skillService.create(subjectName)
        if (res.status == 200) {
            handleCloseAdd()
            setIsUpdate(true);
            setSubjectName("")
        }
    }

    async function updateSubject() {
        console.log(idSubject)
        const res = await skillService.updateById(idSubject, subjectName)
        if (res.status == 200) {
            handleCloseAdd()
            setIsUpdate(true);
            setSubjectName("")
        }
    }


    return (
        <div>
            <div className="d-flex justify-content-between">
                <HeadPage name={'Skill'}></HeadPage>
                {(user == "admin")
                    ? <button className="btn btn-success btn-sm" onClick={() => { handleShowAdd(false) }}>Add</button> : ""
                }


            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">No.</th>
                        <th scope="col">name</th>
                        <th scope="col">lavel</th>
                        <th scope="col" className="text-center">exp</th>
                        <th scope="col" className="text-center">hours</th>
                        <th scope="col" className="text-end">action</th>
                    </tr>
                </thead>
                <tbody>
                    {dataSkill.data.map((res: SkillRes, i: any) => {
                        return <tr key={res.id}>
                            <th scope="row">{indexData(i, active, pagination.size)}</th>
                            <td>{res.name}</td>
                            <td>2</td>
                            <td >
                                <div className="mt-2">
                                    <ProgressBar animated now={60} label={`${60}%`} />
                                </div>
                            </td>
                            <td className="text-center">
                                <div style={{marginTop: '3px'}}>
                                    <Badge bg="primary">{res.hours_total} hours</Badge>
                                </div>
                            </td>
                            <td className="text-end">
                                <button className="btn btn-primary btn-sm me-2" onClick={() => handleShow(res.id)}>Timer</button>
                                {(user == 'admin')
                                    ? <button type="button" className="btn btn-primary btn-sm me-2" onClick={() => handleShowAdd(true, res.id)}>Edit</button> : ""}
                                {(user == 'admin')
                                    ? <button type="button" className="btn btn-danger btn-sm" onClick={() => handleShowDelete(res.id)}>Delete</button> : ""
                                }

                            </td>
                        </tr>
                    })}
                </tbody>
            </table>

            {(dataSkill.total_data == 0)
                ? <div className="text-center">
                    <h6>no data found</h6>
                </div>
                : ""
            }

            {(dataSkill.total_data != 0)
                ? <Paginations active={active} totalPages={pagination.totalPages} onChangePage={(e) => onChangePage(e)} ></Paginations> : ""
            }


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
                        <input
                            ref={inputTag}
                            type="text"
                            className="form-control"
                            value={tag}
                            disabled={isActive}
                            placeholder="#Tag..."
                            onChange={(e) => { setTag(e.target.value) }}
                        />
                    </div>

                    <div className={`text-center`}>
                        <h1 className={HomeCss.font_time}>{time.hours}:{time.minutes}:{time.seconds}</h1>
                    </div>
                </Modal.Body>
                <Modal.Footer className={HomeCss.justify_center}>
                    <Button variant={(isActive == true) ? "danger" : "success"} className={HomeCss.btn_with} onClick={(isActive == true) ? handleClose : startTimer}>
                        {(isActive == true) ? "Stop" : "Start"}
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal
                show={showDelete}
                onHide={handleCloseDelete}
                style={{
                    marginTop: '150px'
                }}
            >
                <Modal.Header closeButton >
                    <Modal.Title>Delete Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <h5>Want to delete this information?</h5>
                    </div>
                </Modal.Body>
                <Modal.Footer className={HomeCss.justify_center}>
                    <button type="button" className="btn btn-danger" onClick={deleteSubject}>Delete</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseDelete}>Cancel</button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showAdd}
                onHide={handleCloseAdd}
                style={{
                    marginTop: '150px'
                }}
            >
                <Modal.Header closeButton >
                    <Modal.Title>{(isEdit == true) ? "Edit" : "Add"} Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">Name</span>
                        <input type="text" value={subjectName} onChange={(e) => { setSubjectName(e.target.value) }} className="form-control" placeholder="Subject Name" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                </Modal.Body>
                <Modal.Footer className={HomeCss.justify_center}>
                    <button type="button" className="btn btn-success" onClick={() => { (isEdit == true) ? updateSubject() : saveSubject() }}>Save</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseAdd}>Cancel</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export async function getStaticProps(context: any) {
    const data = await skillService.getApiSubjects(paginationDefault.page, paginationDefault.size)
    return {
        props: { response: data },
    }
}



export default Skill


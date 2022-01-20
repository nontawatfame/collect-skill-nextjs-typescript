import { NextPage } from "next"
import { useEffect, useRef, useState } from "react";
import { Badge, Button, Modal, Pagination, ProgressBar } from "react-bootstrap"
import HomeCss from '../styles/Home.module.css';
import HeadPage from "../components/head-page"
import Paginations, { PaginationData, paginationDefault, DataOnChangePage, processPages, indexData, ResPagination } from '../components/paginations'
import { ResLog, SkillRes } from "../components/model/skill";
import dayjs from "dayjs";

import * as skillService from "../service/skill-service"
import * as tagService from "../service/tag-service"
import { logTimesCreate } from "../service/log-times-service";
import { LogTime } from "../components/model/logTime";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Toast from "../components/toast";
import { TagModel } from "../components/model/tag";

const Skill: NextPage<{ props: string, response: ResPagination<SkillRes> }> = ({ props, response }) => {
    const [dataSkill, setDataSkill] = useState<ResPagination<SkillRes>>(response)
    const [pagination] = useState<PaginationData>({
        ...paginationDefault,
        totalPages: response.total_pages
    })
    const router = useRouter()
    let user = router.query.user


    const [active, setActive] = useState<number>(1)

    const [tag, setTag] = useState<string>("")
    const [tagList, setTagList] = useState<Array<TagModel>>([])

    const [idSubject, setIdSubject] = useState<number>(0);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = async (id: any, name: string) => {
        setIdSubject(id)
        setSubjectName(name)
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

    const [showDelete, setShowDelete] = useState(false)
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = (id: number, subjectName: string) => {
        setIdSubject(id)
        setSubjectName(subjectName)
        setShowDelete(true)
    }

    const [showAdd, setShowAdd] = useState(false)
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = async (isEdit: boolean, id: number = 0) => {
        if (isEdit == true) {
            const res = await skillService.getSubjectById(id)
            const data = await res.data
            setSubjectName(data[0].name)
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

    const [showAddTag, setShowAddTag] = useState(false)
    const [tagNameAdd, setTagNameAdd] = useState("")
    const handleCloseAddTag = () => setShowAddTag(false)
    const handleShowAddTag = () => {
        handleClose()
        setShowAddTag(true)
    }
    const handleOnExited = () => {
        setShow(true);
        setTagNameAdd("")
    }

    async function saveTag() {
        console.log(tagNameAdd)
        if (tagNameAdd == "") {
            Toast.fire({icon: 'error',title: "required field tag name"})
            return false
        }

        const resTag = await tagService.checkTagName(tagNameAdd, idSubject, 0)
        const dataTag : Array<TagModel> = await resTag.data

        if (dataTag.length > 0) {
            if (dataTag[0].name == tagNameAdd) {
                Toast.fire({icon: 'error',title: "duplicate name"})
                return false 
            }
        }

        let res = await tagService.create(tagNameAdd, idSubject);
        let data = await res.data
        if (res.status == 201) {
            Toast.fire({icon: 'success', title: data.message})
        } else if (res.status == 500) {
            Toast.fire({icon: 'error',title: "something went wrong"})
        }   
        handleCloseAddTag()
    }

    async function startTimer() {
        setIsActive(true);
        setDateStart(dayjs())
    }

    async function stopTimer() {

        let isStartTimer = isActive;
        setIsActive(false);
        console.log("stopTimer")
        handleClose()
        setTime({
            seconds: "00",
            minutes: "00",
            hours: "00"
        })

        if (isStartTimer == true) {
            let logTimeCreate: LogTime = {
                subjectId: idSubject,
                timeStart: dateStart.toDate(),
                timeEnd: dateEnd.toDate(),
                totalSeconds: Math.sign(dateEnd.diff(dateStart, "seconds")) == -1 ? 0 : dateEnd.diff(dateStart, "seconds"),
                tagId: (tag == "") ? null : tag
            }
            console.log(tag)

            const res = await logTimesCreate(logTimeCreate);
            let data: ResLog = await res.data

            setTimeout(() => {
                let skill = dataSkill
                skill.data = skill.data.map((value: SkillRes) => {
                    if (value.id == data.data[0].id) {
                        return data.data[0]
                    }
                    return value
                })
                let resSkill = { ...skill }
                setDataSkill(resSkill)
            }, 700);
        }

        setTag("")
    }

    useEffect(() => {
        async function subjectId() {
            const res = await tagService.subjectId(idSubject);
            const data: Array<TagModel> = await res.data
            setTagList(data)
        }

        subjectId()     
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    useEffect(() => {
        console.log("interval")
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
        console.log("apiSubject")
        async function apiSubject() {
            let res = await skillService.getApiSubjects(active, pagination.size)
            let data: ResPagination<SkillRes> = res.data
            pagination.totalPages = data.total_pages
            if (data.data.length == 0) {
                setActive(processPages({ pagination: "prev", page: 0 }, active, pagination.totalPages))
            }
            setDataSkill(data)
        }

        apiSubject()

        return () => {
            setIsUpdate(false)
        }
    }, [active, pagination, isUpdate])

    async function deleteSubject() {
        const res = await skillService.deleteById(idSubject)
        const data = await res.data
        if (res.status == 200) {
            Toast.fire({icon: 'success', title: data.message})
            handleCloseDelete()
            setIsUpdate(true);
        } else if (res.status == 500) {
            Toast.fire({icon: 'error',title: "something went wrong"})
        }  
    }

    async function saveSubject() {
        if (subjectName == "") {
            Toast.fire({icon: 'error',title: "required field subject name"})
            return false
        }

        const resSubjectName = await skillService.checkSubjectName(subjectName, 0);
        const dataSubjectName : Array<SkillRes> = await resSubjectName.data
        
        if (dataSubjectName.length > 0) {
            if (dataSubjectName[0].name == subjectName) {
                Toast.fire({icon: 'error',title: "duplicate name"})
                return false 
            }
        }
        
        const res = await skillService.create(subjectName)
        const data = await res.data
        if (res.status == 201) {
            Toast.fire({icon: 'success', title: data.message})
            handleCloseAdd()
            setIsUpdate(true);
            setSubjectName("")
        } else if (res.status == 500) {
            Toast.fire({icon: 'error',title: "something went wrong"})
        }   
    }

    async function updateSubject() {
        if (subjectName == "") {
            Toast.fire({icon: 'error',title: "required field subject name"})
            return false
        }

        const resSubjectName = await skillService.checkSubjectName(subjectName, idSubject);
        const dataSubjectName : Array<SkillRes> = await resSubjectName.data
        
        if (dataSubjectName.length > 0) {
            if (dataSubjectName[0].name == subjectName) {
                Toast.fire({icon: 'error',title: "duplicate name"})
                return false 
            }
        }

        const res = await skillService.updateById(idSubject, subjectName)
        const data = await res.data
        console.log(data)
        if (res.status == 200) {
            Toast.fire({icon: 'success', title: data.message})
            handleCloseAdd()
            setIsUpdate(true);
            setSubjectName("")
        } else if (res.status == 500) {
            Toast.fire({icon: 'error',title: "something went wrong"})
        }   
    }

    function number2decimals(number: number): number {
        return parseFloat(number.toFixed(2));
    }

    function convertHours(number: number) {
        let d = Number(number);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);

        var hDisplay = h > 0 ? (h < 10 ? `0${h}` : `${h}`) : "00";
        var mDisplay = m > 0 ? (m < 10 ? `0${m}` : `${m}`) : "00";
        return hDisplay + ':' + mDisplay
    }


    return (
        <div>
            <div className="d-flex justify-content-between">
                <HeadPage name={'Skill'}></HeadPage>
                {(user == "admin")
                    ? <button className="btn btn-success btn-sm" onClick={() => { handleShowAdd(false) }}>
                        <FontAwesomeIcon style={{ width: '11px', paddingBottom: '2px' }} icon={'plus'} /> Add</button> : ""
                }


            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" style={{ width: "5%" }}>No.</th>
                        <th scope="col" style={{ width: "2%" }}>name</th>
                        <th scope="col" style={{ width: "5%" }} className="text-center">lavel</th>
                        <th scope="col" style={{ width: "10%" }} className="text-center">exp</th>
                        <th scope="col" style={{ width: "10%" }} className="text-center">hours</th>
                        <th scope="col" style={{ width: "20%" }} className="text-end">action</th>
                    </tr>
                </thead>
                <tbody>
                    {dataSkill.data.map((res: SkillRes, i: any) => {
                        return <tr key={res.id} style={{ verticalAlign: "middle" }}>
                            <th scope="row">{indexData(i, active, pagination.size)}</th>
                            <td>{res.name}</td>
                            <td className="text-center">{res.level}</td>
                            <td >
                                <div className="mt-2">
                                    <ProgressBar animated now={number2decimals(((res.seconds_total - (res.exp_next - 36000)) / 36000) * 100)} label={`${number2decimals(((res.seconds_total - (res.exp_next - 36000)) / 36000) * 100)}%`} />
                                    <label htmlFor="" style={{ fontSize: "11px" }}>exp : ({res.seconds_total})</label>
                                </div>
                            </td>
                            <td className="text-center">
                                <div style={{ marginTop: '3px' }}>
                                    <div><Badge bg="primary">{Math.floor(number2decimals(res.seconds_total / 3600))} hours</Badge></div>
                                    <label htmlFor="" style={{ fontSize: "11px" }}>hours : ({convertHours(res.seconds_total)})</label>
                                </div>
                            </td>
                            <td className="text-end">
                                <button className="btn btn-primary btn-sm me-2" onClick={() => handleShow(res.id, res.name)}>
                                    <FontAwesomeIcon style={{ width: '14px', paddingBottom: '2px' }} icon={'clock'} /> Timer
                                </button>
                                {(user == 'admin')
                                    ? <button type="button" className="btn btn-primary btn-sm me-2" onClick={() => handleShowAdd(true, res.id)}>
                                        <FontAwesomeIcon style={{ width: '14px', paddingBottom: '2px' }} icon={'pencil-alt'} /> Edit
                                    </button> : ""}
                                {(user == 'admin')
                                    ? <button type="button" className="btn btn-danger btn-sm" onClick={() => handleShowDelete(res.id, res.name)}>
                                        <FontAwesomeIcon style={{ width: '14px', paddingBottom: '2px' }} icon={'trash-alt'} /> Delete
                                    </button> : ""
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
                    <Modal.Title>Timer : {subjectName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">Tag</span>
                        <select
                            className="form-select"
                            id="inputGroupSelect01"
                            disabled={isActive}
                            defaultValue={tag}
                            onChange={(e) => { setTag(e.target.value) }}
                        >
                            <option value={""}>Choose...</option>
                            {tagList.map((tag: TagModel) => {
                                return  <option key={tag.id} value={tag.id}>{tag.name}</option>
                            })}
                        </select>
                        <button
                            className="btn btn-secondary"
                            type="button"
                            disabled={isActive}
                            onClick={handleShowAddTag}
                        >
                            <FontAwesomeIcon style={{ width: '11px', paddingBottom: '2px' }} icon={'plus'} /> add
                        </button>
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
                        <h5>Want to delete this {subjectName} subject?</h5>
                    </div>
                </Modal.Body>
                <Modal.Footer className={HomeCss.justify_center}>
                    <button type="button" className="btn btn-danger" onClick={deleteSubject}>
                        <FontAwesomeIcon style={{ width: '14px', paddingBottom: '4px' }} icon={'trash-alt'} /> Delete
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseDelete}>
                        <FontAwesomeIcon style={{ width: '13px', paddingBottom: '2px' }} icon={'times'} /> Cancel
                    </button>
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
                    <button type="button" className="btn btn-success" onClick={() => { (isEdit == true) ? updateSubject() : saveSubject() }}>
                        <FontAwesomeIcon style={{ width: '14px', paddingBottom: '5px' }} icon={'save'} /> Save
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseAdd}>
                        <FontAwesomeIcon style={{ width: '13px', paddingBottom: '2px' }} icon={'times'} /> Cancel
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showAddTag}
                onHide={handleCloseAddTag}
                style={{
                    marginTop: '150px',
                }}
                onExited={handleOnExited}
            >
                <Modal.Header closeButton >
                    <Modal.Title>Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">Name</span>
                        <input type="text" value={tagNameAdd} onChange={(e) => { setTagNameAdd(e.target.value) }} className="form-control" placeholder="Tag Name" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                </Modal.Body>
                <Modal.Footer className={HomeCss.justify_center}>
                    <button type="button" className="btn btn-success" onClick={() => { saveTag() }}>
                        <FontAwesomeIcon style={{ width: '14px', paddingBottom: '5px' }} icon={'save'} /> Save
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseAddTag}>
                        <FontAwesomeIcon style={{ width: '13px', paddingBottom: '2px' }} icon={'times'} /> Cancel
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export async function getStaticProps(context: any) {
    const res = await skillService.getApiSubjects(paginationDefault.page, paginationDefault.size)
    const data = res.data
    return {
        props: { response: data },
    }
}

export default Skill


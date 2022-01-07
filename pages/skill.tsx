import { NextPage } from "next"
import { useEffect, useState } from "react";
import { Badge, Button, Modal, ProgressBar } from "react-bootstrap"
import HomeCss from '../styles/Home.module.css';

import HeadPage from "../components/head-page"
import { SkillRes } from "../components/model/skill";
import dayjs from "dayjs";
import axios from "axios";

const Skill: NextPage<{props: string, data: Array<SkillRes>}> = ({props, data}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id: any) => {
        console.log(id)
        setShow(true);
    }

    console.log(data)

    const [time, setTime] = useState<{
        [key: string]: string
    }>({
        seconds: "00",
        minutes: "00",
        hours: "00"
    })

    const [isActive, setIsActive] = useState(false);
    const [dateStart, setDateStart] = useState(dayjs());

    function startTimer() {
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
        console.log(isActive)
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
                    {data.map((res: SkillRes, i: any) => {
                         return <tr key={res.id}>
                            <th scope="row">{i+1}</th>
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
    const res = await axios(`${process.env.URL_API_NEXT}/subjects`)
    const data = await res.data
    return {
        props: { data }, 
    }
}

export default Skill
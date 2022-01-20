import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

const Home: NextPage = ({ props }: any) => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [time, setTime] = useState<{
    [key: string]: string
  }>({
    seconds : "00",
    minutes : "00",
    hours : "00"
  })

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [dateStart, setDateStart] = useState(dayjs());
  const [arrayDate, setArrayDate] = useState<Array<any>>([]);

  function toggle() {
    setIsActive(true);
    setDateStart(dayjs())
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
    setTime({
      seconds : "00",
      minutes : "00",
      hours : "00"
    })
    let endDate = dayjs()
    arrayDate.push({
      dateStart: dateStart,
      dateEnd: endDate
    })
  }

 

  useEffect(() => {
    let interval: any = null;
    if (isActive == true) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
        secondsToHms(dayjs().diff(dateStart, "seconds"))
      }, 1000);
    } else if (isActive == false) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [dateStart, isActive, seconds]);

  function secondsToHms(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? (h < 10 ? `0${h}`: `${h}`) : "00";
    var mDisplay = m > 0 ? (m < 10 ? `0${m}`: `${m}`) : "00";
    var sDisplay = s > 0 ? (s < 10 ? `0${s}`: `${s}`) : "00";

    setTime({
      seconds : sDisplay,
      minutes : mDisplay,
      hours : hDisplay
    })
}

  
  return (
    <div className='container mt-5'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{marginTop: '10px', marginBottom: '10px'}}>
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <a className="navbar-brand" href="#">Navbar</a>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled">Disabled</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <button className='btn btn-success'>submit</button>{' '}
      <button className='btn btn-primary'>submit</button>{' '}
      <button className='btn btn-danger'>submit</button>{' '}
      <button className='btn btn-warning'>submit</button>{' '}
      <button className='btn btn-light'>submit</button>
      <br/>
      <br/>

      <button className='btn btn-primary' onClick={handleShow} style={{marginRight: '10px'}} >modal</button>
      <button className='btn btn-primary' onClick={handleShow2}>modal2</button>

      <Modal 
        show={show} 
        onHide={handleClose} 
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, re reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      
      <Modal 
        show={show2} 
        onHide={handleClose2} 
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading 2</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, re reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose2}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <label htmlFor="test" style={{
        display: "block",
        marginTop: "10px"
      }}>
        {time.hours} : {time.minutes} : {time.seconds}
      </label>

      <button className='btn btn-primary' style={{marginRight: "10px"}} onClick={toggle} disabled={isActive == true}>จับเวลา</button>
      <button className='btn btn-primary' style={{marginRight: "10px"}} onClick={reset}>หยุด</button>

      <div className="time">
        {seconds}s
      </div>

      {arrayDate.map((data: any, i: any) => {
        return <div key={i}>{data.dateStart.format("DD/MM/YYYY HH:mm:ss")} : {data.dateStart.format("DD/MM/YYYY HH:mm:ss")}</div> 
      })}
    </div>
  )
}

export default Home

import { NextPage } from "next"
import Link from 'next/link'
import { useRouter } from "next/router"


const Navbar: NextPage = ({ props }: any) => {
    const router = useRouter()
    const checkActive = (url: string) => {
        if (router.asPath == url) {
            return "active"
        } else {
            return ""
        }
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm" style={{marginBottom: '10px' }}>
                <div className="container">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <a className="navbar-brand" href="#">CollectSkill</a>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link href="/">
                                    <a className={"nav-link " + checkActive("/")}>Dashboard</a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/skill">
                                    <a className={"nav-link " + checkActive("/skill")}>Skill</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
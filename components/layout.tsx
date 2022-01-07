import { NextPage } from "next"
import Navbar from "./navbar"


const Layout: NextPage = ({ children }: any) => {
    return (
        <>
            <Navbar/>
            <main className="container mt-4">{children}</main>
        </>
    )
}

export default Layout
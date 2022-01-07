import { NextPage } from "next"
import HeadPage from "../components/head-page"

const Dashboard: NextPage = ({ props }: any) => {
    return (
        <div>
            <HeadPage name={'Dashboard'}></HeadPage>
        </div>
    )
}

export default Dashboard
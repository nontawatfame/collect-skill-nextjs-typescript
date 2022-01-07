import { NextPage } from "next"

const HeadPage: NextPage<any> = (props: any) => {
    return (
        <div>
            <h4>{props.name}</h4>
        </div>
    )
}

export default HeadPage
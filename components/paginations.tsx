import { NextPage } from "next"
import { Pagination } from "react-bootstrap"

export interface PaginationData {
    page: number,
    size: number,
    totalPages: number
}

export const paginationDefault: PaginationData = {
    page: 1,
    size: 10,
    totalPages: 0
}

interface Props {
    active: number,
    totalPages: number,
    onChangePage(e: DataOnChangePage) : any
}

export interface DataOnChangePage {
    pagination: string,
    page: number
}

export function processPages(e: DataOnChangePage, active: number, totalPages: number): any {
    console.log(totalPages)
    if (e.pagination == "item") {
        return e.page
    } else if (e.pagination == "first") {
        return 1
    } else if (e.pagination == "last") {
        return totalPages
    } else if (e.pagination == "prev") {
        if (active > 1) {
            return active - 1
        } 
    } else if (e.pagination == "next") {
        if (active < totalPages) {
            return active + 1
        }
    }

    return active
}

export function indexData(index: number, page: number, size: number): number {
    return (index + 1) + ((page - 1) * size)
}

const Paginations: NextPage<Props> = (props) => {
    let items = [];
    for (let number = 1; number <= props.totalPages; number++) {
        items.push(
          <Pagination.Item key={number} active={number === props.active} onClick={() => onclick({pagination: "item", page: number})}>
            {number}
          </Pagination.Item>,
        );
      }


    function onclick(e:DataOnChangePage) {
        props.onChangePage(e)
    }

    return (
        <div>
            <Pagination>
                <Pagination.First onClick={() => onclick({pagination: "first", page: 0})}/>
                <Pagination.Prev onClick={() => onclick({pagination: "prev", page: 0})}/>
                {items}
                <Pagination.Next onClick={() => onclick({pagination: "next", page: 0})}/>
                <Pagination.Last onClick={() => onclick({pagination: "last", page: 0})} />
            </Pagination>
        </div>
    )
}

export default Paginations

import PathBar from "../components/PathBar"
import ListGroup from "../components/ListGroup"

export default function ContentViewer(): JSX.Element {   
    return (
        <div className="container-xl">
            <PathBar />
            <ListGroup/>
        </div>
    )
};
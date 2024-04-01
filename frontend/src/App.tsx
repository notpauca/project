import ListGroup from './components/ListGroup';
import { PathBar } from './components/PathBar';
import { NavigationBar } from './components/NavigationBar';


const api: string = "http://localhost:3000";
const headers: RequestInit = { method: "GET", mode: "cors" };

export class FileInfo {
    public name: string;
    public type: string;
    public path: string;
    public time: string;
    constructor(name: string, type: string, path: string, time: string) {
        this.name = name;
        this.type = type;
        this.path = path;
        this.time = new Date(time).toString();
    }
}

export const Fetcher = async (path: string) => (await fetch(api + path, headers));

function Application() {
    return (
        <>
            <div>
                <NavigationBar />
                <PathBar />
                <ListGroup />

            </div>
        </>
    )
}

export default Application;

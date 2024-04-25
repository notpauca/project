import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';

export default function NavigationBar(): JSX.Element {
    return (
        <nav className='navbar navbar-expand-lg navbar-dark shadow-5-strong'>
            <div className="container-fluid">
                <Link className='navbar-brand' to='/'> <img src={logo} width="auto" height="100px" /> </Link>
                <Link className="navbar-brand" to="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Home</Link>
                <Link className='navbar-brand' to="/timetable">Stundu saraksts</Link>
                {localStorage.getItem("token")
                ?<Link className="navbar-brand" to="/login">Iziet</Link>
                :<Link className="navbar-brand" to="/login">Ieiet</Link>}
            </div>
        </nav>
    );
}
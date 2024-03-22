import logo from '../assets/logo.png'

export function NavigationBar() {
    return(
        <nav className='navbar navbar-expand-lg navbar-dark shadow-5-strong'>
            <div className="container-fluid">
                <a className='navbar-brand' href='/'>
                    <img src={logo} width="auto" height="100px"/>
                </a>                
                <a className="navbar-brand" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Home</a>
            </div>
        </nav>
    );
}
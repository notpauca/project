import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './pages/Root.tsx'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <div className='background shadow-2-strong'>
        <React.StrictMode>
            <Root/>
        </React.StrictMode>
    </div>
)

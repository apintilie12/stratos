import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/global.css'
import './index.css'
import App from './App.tsx'
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc);
dayjs.extend(timezone);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)

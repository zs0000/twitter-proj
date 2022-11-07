import ExploreBar from '../ExploreBar/ExploreBar'
import Sidebar from '../Sidebar/Sidebar'
import s from './Layout.module.css'

export default function Layout({children}){
    return <div className={s.container}><Sidebar/>{children}<ExploreBar/></div>
}
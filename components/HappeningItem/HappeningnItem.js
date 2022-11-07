import s from './HappeningItem.module.css'

export default function HappeningItem({subject, type, image, text, tweets}){

    
    return(
        <div className={s.container}>
            <div className={s.leftcontainer}>
            <div className={s.classifycontainer}>
                <span className={s.subject}>
                {subject}
                </span>
                <span className={s.type}>
                {type}
                </span>
            </div>
            <div className={s.textcontainer}>
            <span className={s.text}>
                {text}
            </span>
            </div>
            <span className={s.tweets}>
                {tweets}
            </span>
            </div>
            <div className={s.rightcontainer}>
                {image}
            </div>
        </div>
    )
}
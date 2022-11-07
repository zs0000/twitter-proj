import s from "./ProfileNavbar.module.css"

export default function ProfileNavbar({fullname, tweets}) {
  return (
    <div className={s.container}>
        <div className={s.svgcontainer}>

        </div>
        <div className={s.profilecontainer}>
            <span className={s.profile}>
                {fullname ? fullname : "Profile name"}
            </span>
            <span className={s.tweets}>
                {tweets ? tweets : 0} Tweets
            </span>
        </div>
    </div>
  )
}

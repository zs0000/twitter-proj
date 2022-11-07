import HappeningItem from "../HappeningItem/HappeningnItem";
import FollowItem from "../FollowItem/FollowItem";
import s from "./ExploreBar.module.css"
import elonna from "../../public/elonna.jpg"

export default function ExploreBar(){
    const ExploreItems = [
        {
            subject: "Tech",
            type: "Trending",
            text: "Obama kissed elon musk after the most recent purchase of Twitter",
     
            tweets:"420k Tweets"
        },
        {
            subject: "Romance",
            type: "Trending",
            text: "Elon releases 'White Lies' tapes of Obama allegedly saying small, harmless lies",
            image: "https://res.cloudinary.com/repdb/image/upload/v1629843197/blake-connally-B3l0g6HLxr8-unsplash_jqnghm.jpg",
            tweets:"69K Tweets"
        },
        {
            subject: "Tragedy",
            type: "Live",
            text: "Multiple Twitter employees leave after allegations of Chief Twit Musk was having affairs.",

            tweets:"1.3M Tweets"
        }
    ];
    
    const FollowItems =[
        {
            username: "elonmusk",
            fullname: "Elon Musk",
            image: "https://res.cloudinary.com/repdb/image/upload/v1667855210/elonna.jpg"
        },
        {
            username: "obama",
            fullname: "Barack Obama",
            image: "https://res.cloudinary.com/repdb/image/upload/v1667855210/obama.jpg"
        },
        {
            username: "mrsobama",
            fullname: "Michelle Obama",
            image: "https://res.cloudinary.com/repdb/image/upload/v1667855210/michellla.jpg"
        },
        
    ];



    return(
        <div className={s.container}>
            <div className={s.explorecontainer}>
            <div className={s.searchcontainer}>
                <input className={s.search} type="text" placeholder="Search.." />
            </div>
            <div className={s.happeningcontainer}>
                <div className={s.labelcontainer}>
                <span className={s.label}>
                    What's happening
                </span>
                </div>
                
            {ExploreItems.map((item)=>(
                <HappeningItem 
                subject={item.subject}
                 type={item.type}
                  text={item.text}
                   image={item.image}
                   tweets={item.tweets}
                   key={item.text}
                   />
            ))}
            

            </div>
            <div className={s.followcontainer}>
            <div className={s.labelcontainer}>
                <span className={s.label}>
                   Who to follow
                </span>
                </div>
            {FollowItems.map((item)=>(
                <FollowItem
                username={item.username}
                fullname={item.fullname}
                image={item.image}
                key={item.username}
                />
            ))}
            </div>
            </div>
        </div>
    )
}
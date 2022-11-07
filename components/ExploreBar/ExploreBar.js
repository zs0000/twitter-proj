import HappeningItem from "../HappeningItem/HappeningnItem";
import FollowItem from "../FollowItem/FollowItem";
import s from "./ExploreBar.module.css"


export default function ExploreBar(){
    const ExploreItems = [
        {
            subject: "Tech",
            type: "Trending",
            text: "Obama kissed elon musk after the most recent purchase of Twitter",
            image: "its an image",
            tweets:"420k Tweets"
        },
        {
            subject: "Romance",
            type: "Trending",
            text: "Elon releases 'White Lies' tapes of Obama allegedly saying small, harmless lies",
            image: "its an image 22",
            tweets:"69K Tweets"
        },
        {
            subject: "Tragedy",
            type: "Live",
            text: "Multiple Twitter employees leave after allegations of Chief Twit Musk was having affairs.",
            image: "its an image three",
            tweets:"1.3M Tweets"
        }
    ];
    
    const FollowItems =[
        {
            username: "elonmusk",
            fullname: "Elon Musk",
            image: "hi, im an image"
        },
        {
            username: "obama",
            fullname: "Barack Obama",
            image: "hi, im an image as well"
        },
        {
            username: "mrsobama",
            fullname: "Michelle Obama",
            image: "hi, im an image too"
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
                />
            ))}
            </div>
            </div>
        </div>
    )
}
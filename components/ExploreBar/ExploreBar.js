import HappeningItem from "../HappeningItem/HappeningnItem";
import FollowItem from "../FollowItem/FollowItem";
import s from "./ExploreBar.module.css"
import elonna from "../../public/elonna.jpg"

export default function ExploreBar(){
    const ExploreItems = [
        {
            subject: "Tech",
            type: "Trending",
            text: "OpenAi fires themselves after creating a robot that can create robots that can create robots.",
     
            tweets:"424k Tweets"
        },
        {
            subject: "Romance",
            type: "Trending",
            text: "The new 'valley' of love is the new 'valley' of death, in this romance novel.",
            image: "https://res.cloudinary.com/repdb/image/upload/v1629843197/blake-connally-B3l0g6HLxr8-unsplash_jqnghm.jpg",
            tweets:"66K Tweets"
        },
        {
            subject: "Tragedy",
            type: "Live",
            text: "AI Agents are now a larger percentage of the workforce than humans, setting an unprecedented record.",

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
                    Whats happening
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
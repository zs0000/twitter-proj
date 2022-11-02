import { useContext, useState } from "react";
import { PostContext } from "../../../../../context/PostContext";

export default function StatusPage(){

    const [loading, setLoading] = useState(true);
    const {recentPost, setRecentPost} = useContext(PostContext);
    const { isLoading, isError, data, error } = useQuery({ queryKey: ['todos'], queryFn: getFeedContented })
    console.log(recentPost)

    return(
        <>
        First Status Page !!!
       
        </>
    )
}
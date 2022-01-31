import { Button } from "antd";
import { useRouter } from "next/dist/client/router";

function UserExploreCard({userCard}) {
    console.log("userCard : ", userCard.attributes);
    const router = useRouter();

    return (
        <div>
            <div className="" onClick={() => router.push(`/userProfile/${userCard.attributes.ethAddress}`)}>
                {userCard.attributes.username}
                <img src={userCard.attributes.avatar} className="rounded-full h-11 w-11 object-contain  p-1" alt="" />
            </div>
            <Button>Follow</Button>
        </div>
    )
}

export default UserExploreCard

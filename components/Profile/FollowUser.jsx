import { useMoralis, useMoralisCloudFunction } from "react-moralis";

function FollowUser({ethAddress}) {


    async function FollowUser() {

        const { authenticate, isAuthenticated, logout, user} = useMoralis();


        const { data: data2, error: error2, isLoading: isLoading2 } = await useMoralisCloudFunction("SetFollowingUser", {
            meEthAddress: user.attributes.ethAddress,
            ethAddress: ethAddress,
        });


    }

    FollowUser();

    return (
        <div>
            
        </div>
    )
}

export default FollowUser

import { useMoralis, useMoralisCloudFunction } from "react-moralis";

function FollowUser({ethAddress}) {

   // console.log("props : ", props);

    async function FollowUser() {

        const { authenticate, isAuthenticated, logout, user} = useMoralis();

        // function handleChange(trueOrFalse) {
        //     // Here, we invoke the callback with the new value
        //     props.onChange(trueOrFalse);
        // }

       // console.log("ethAddressUser : ", props.ethAddress);

        const { data: data2, error: error2, isLoading: isLoading2 } = await useMoralisCloudFunction("SetFollowingUser", {
            meEthAddress: user.attributes.ethAddress,
            ethAddress: ethAddress,
        });

        // if(data2){
        //      console.log("datadatadata : ", data2);
        //     // console.log("valueInChild : ", props.value);
        //     // handleChange(false)
        // }
    }

    FollowUser();

    return (
        <div>
            
        </div>
    )
}

export default FollowUser

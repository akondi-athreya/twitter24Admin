import axios from "axios"
const getUserPlan = async (USERID) => {
    const baseurl = process.env.REACT_APP_API;
    // const {USERID} = JSON.parse(localStorage.getItem("userData"));
    await axios.get(baseurl+"/api/user/get_user_plan/"+USERID)
    .then((res) => {
        console.log(res);
        if(res.data.data === 'none') {
            localStorage.setItem("twitter24userPlan", JSON.stringify(res.data));
        }
        else {
            localStorage.setItem("twitter24userPlan", JSON.stringify(res.data));
        }
        return res.data;
    })
    .catch((err) => {
        console.error(err);
    })


    axios.get(baseurl+"/api/employees/user/"+USERID)
    .then((res) => {
        console.log(res.data);
        localStorage.setItem("userIsEmployee", JSON.stringify(res.data));
    })
    .catch((err) => {
        console.error(err);
    })
}

export default getUserPlan;
import axios from 'axios'

const baseURL = `http://localhost:5000/api`
const token = localStorage.getItem('token')

const API = axios.create({ baseURL, headers: { Authorization: `Bearer ${token}` } });

let resetHead = () => {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
}


const actions = {

    getUser: async () => {
        //This will go get our user every time we refresh 
        return await axios.get(`${baseURL}/user`, resetHead())
    },

    getMyPosts: async () => {
        return await axios.get(`${baseURL}/myPosts`, resetHead())
    },
    getAllPosts: async () => {
        return await axios.get(`${baseURL}/allPosts`, resetHead())
    },
    addPost: async (post) => {
        return await axios.post(`${baseURL}/addAPost`, { post }, resetHead())
    },
    logIn: async (data) => {

        localStorage.setItem('googleTokenId', data.tokenId)

        let headerObj = resetHead()
        headerObj.headers['X-Google-Token'] = data.tokenId

        let resFromOurDB = await axios.post(`${baseURL}/logMeIn`, data, headerObj)

        console.log(resFromOurDB)

        window.localStorage.setItem('token', resFromOurDB?.data?.token)



        return resFromOurDB
    }



}

export default actions
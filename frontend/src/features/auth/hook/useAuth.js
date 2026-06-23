import {useDispatch} from "react-redux";
import {registerUser, loginUser, getMe} from "../service/auth.api"
import { setUser, setError, setLoading } from "../auth.slice";

export function useAuth() {

  const dispatch = useDispatch()

  async function handleRegister({email, username, password}) {
try{
  dispatch(setLoading(true))
  const data = await registerUser({email, username, password})
}catch(error){
dispatch(setError(error.response?.data?.message || "Registration Failed"))
}finally{
  dispatch(setLoading(false))
}
  }

  async function handleLogin({email, password}){
    try{
      
      dispatch(setLoading(true))
      const data = await loginUser({email, password})
      dispatch(setUser(data.user))
      
    }catch(error){
      dispatch(
        setError(error.response?.data?.message || "Login Failed"),
      );
    }
    finally{
      dispatch(setLoading(false))
    }
  }

  async function handleGetMe(){
    try{
      dispatch(setLoading(true))
      const data = await getMe()
      dispatch(setUser(data.user))
    }catch (error) {
      dispatch(setError(error.response?.data?.message || "failed to fetch user data"))
    }finally{
      dispatch(setLoading(false))
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe
  }

}
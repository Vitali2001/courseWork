import * as LoginActions from "../components/auth/login/actions.ts" 
import {useDispatch} from "react-redux"
import {bindActionCreators} from "redux"
import { useMemo } from "react";

const actions = {
    ...LoginActions
};

export const useActions = () =>{
    const dispatch = useDispatch()
    return useMemo(()=> bindActionCreators(actions,dispatch),[dispatch])
}
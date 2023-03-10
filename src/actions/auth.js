import axios from "axios";
import {
  SIGNUP_FAIL,
  SIGNUP_SUCCESS,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  LOGOUT,
  SPINNER_ACTIVATED,
  SPINNER_DISABLED,
  ALERT_FAIL_DISABLED,
  ALERT_FAIL_ACTIVATED,
  ALERT_SUCCESS_ACTIVATED,
  ALERT_SUCCESS_DISABLED
} from "./types";


export const checkAuthenticated = () => async (dispatch) => {
 
  if (localStorage.getItem("access")) {
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    const body = JSON.stringify({ token: localStorage.getItem("access") });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/verify/`,
        body,
        config
      );
      if (res.data.code !== "token_not_valid") {
        dispatch({
          type: AUTHENTICATED_SUCCESS,
        });
      } else {
        dispatch({
          type: AUTHENTICATED_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: AUTHENTICATED_FAIL,
      });
    }
  } else {
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
  }
};

export const spinnerLoading = (status) => (dispatch) => {
  if (status){
    dispatch({
      type: SPINNER_ACTIVATED,
    });
  }
  if(!status) {
    dispatch({
      type: SPINNER_DISABLED,
    });
  }
};

export const load_user = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/users/me/`,
        config
      );

      dispatch({
        type: USER_LOADED_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: USER_LOADED_FAIL,
      });
    }
  } else {
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }
};

/* alert success */
export const actionSuccessAlert = (status) =>async(dispatch)=> {
  if (status){
    dispatch({
      type:ALERT_SUCCESS_ACTIVATED,
    });
  }
  if(!status) {
    dispatch({
      type: ALERT_SUCCESS_DISABLED,
    });
  }

}

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/jwt/create/`,
      body,
      config
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(load_user());
    dispatch(actionSuccessAlert(true));
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};


export const signup = (email,name,password,re_password) => async (dispatch) => {

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email,name,password,re_password });

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`,body,config);

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SIGNUP_FAIL,
    });
  }
};

export const verifyAccount =(uid,token)=>async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ uid, token });

  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`,body,config)
    dispatch({
        type: ACTIVATION_SUCCESS,
   
    })
}catch(err){
    dispatch({type:ACTIVATION_FAIL})
}
};

export const reset_password = (email) => async dispatch=> {
    const config = {
        headers: {
            'Content-Type':'application/json'
        }
    };
    const body =JSON.stringify({email});
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`,body,config)
        dispatch({
            type: PASSWORD_RESET_SUCCESS
        })
    }catch(err){
        dispatch({type:PASSWORD_RESET_FAIL})
    }
}

export const reset_password_confirm = (uid, token, new_password,re_new_password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type':'application/json'
        }
    };
    const body =JSON.stringify({uid, token, new_password,re_new_password});
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`,body,config)
        dispatch({
            type:PASSWORD_RESET_CONFIRM_SUCCESS
        })
    }catch(err){
        dispatch({type: PASSWORD_RESET_CONFIRM_FAIL})
    }

};
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

/* alert error */
export const actionFailedAlert =(status) =>(dispatch)=> {
  if(status){
    dispatch({
      type:ALERT_FAIL_ACTIVATED,
    })
  }
  if(!status){
    dispatch({
      type:ALERT_FAIL_DISABLED,
    })
  }
}


//THEN EXPORT TO REDUCES AUTH

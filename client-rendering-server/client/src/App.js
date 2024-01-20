import { Route, Routes } from 'react-router';
import { Layout } from './layout/Layout'
import { Component } from "react";
import { Users } from "./component/Users";
import { Home } from "./component/Home";
import { SingupEntry } from "./component/signup/Singup-entry";
import { SignupStudent } from "./component/signup/Signup-student";

export default class App extends Component {

    render() {
        return (
            <Layout>
                <Routes>
                    {["/home", "/"].map((path, index) =>
                        <Route path={path} element={<Home/>} key={index} />
                    )}
                    <Route path='/users' element={<Users />} />
                    <Route path='/signup' element={<SingupEntry />} />
                    <Route path='/signup/student' element={<SignupStudent />} />
                </Routes>
            </Layout>
        )
    }

}
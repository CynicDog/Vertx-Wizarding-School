import { Route, Routes, useParams } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { Component } from "react";
import { Users } from "./page/Users";
import { Home } from "./page/Home";
import { SingupEntry } from "./page/signup/SingupEntry";
import { Login } from "./page/login/Login";

import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle'
import Course from "./page/course/Course";
import HouseMain from "./page/house/HouseMain";
import {SignupForm} from "./page/signup/SignupForm";
import {MyPage} from "./component/avatar/MyPage";

export default class App extends Component {
    render() {
        return (
            <Layout>
                <Routes>
                    {["/home", "/"].map((path, index) =>
                        <Route path={path} element={<Home />} key={index} />
                    )}
                    <Route path='/users' element={<Users />} />
                    <Route path='/signup' element={<SingupEntry />} />
                    <Route path='/signup/:type' element={<SignupRouter />} />
                    <Route path='/login' element={<Login /> }></Route>
                    <Route path='/my-page' element={<MyPage />} />
                    <Route path='/house' element={<HouseMain />} />
                    <Route path='/course' element={<Course />} />
                </Routes>
            </Layout>
        );
    }
}

const SignupRouter = () => {
    const { type } = useParams();

    if (type === 'student') {
        return <SignupForm type={type} />;
    } else if (type === 'teacher') {
        return <SignupForm type={type} />;
    } else {
        return <div>Invalid sign-up type</div>;
    }
};

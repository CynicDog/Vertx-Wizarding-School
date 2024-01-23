import { Route, Routes, useParams } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { Component } from "react";
import { Users } from "./component/Users";
import { Home } from "./component/Home";
import { SingupEntry } from "./component/signup/Singup-entry";
import { SignupStudent } from "./component/signup/Signup-student";
import { SignupTeacher } from "./component/signup/Signup-teacher";
import { Login } from "./component/login/Login";

import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle'
import Course from "./component/course/Course";
import House from "./component/house/House";
import MyPage from "./component/user-page/MyPage";

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
                    <Route path='/house' element={<House />} />
                    <Route path='/course' element={<Course />} />
                </Routes>
            </Layout>
        );
    }
}

const SignupRouter = () => {
    const { type } = useParams();

    if (type === 'student') {
        return <SignupStudent type={type} />;
    } else if (type === 'teacher') {
        return <SignupTeacher type={type} />;
    } else {
        return <div>Invalid sign-up type</div>;
    }
};

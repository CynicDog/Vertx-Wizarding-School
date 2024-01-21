import { Route, Routes, useParams } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { Component } from "react";
import { Users } from "./component/Users";
import { Home } from "./component/Home";
import { SingupEntry } from "./component/signup/Singup-entry";
import { SignupStudent } from "./component/signup/Signup-student";
import { SignupTeacher } from "./component/signup/Signup-teacher";
import { Login } from "./component/Login/Login";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle'

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
                    {/* Use the useSignupRoute function to render the appropriate Signup component */}
                    <Route path='/signup/:type' element={<SignupRouter />} />
                    <Route path='/login' element={<Login /> }></Route>
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

import { Route, Routes } from 'react-router';
import { Layout } from './layout/Layout'
import { Component } from "react";
import { Users } from "./component/Users";
import { Home } from "./component/Home";

export default class App extends Component {

    render() {
        return (
            <Layout>
                <Routes>
                    <Route exact path ='/' element={<Home />} />
                    <Route path='/users' element={<Users />} />
                </Routes>
            </Layout>
        )
    }

}
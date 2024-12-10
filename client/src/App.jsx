import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route, Router} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import Additem from './Additem'
import UpdateItem from './UpdateItem'
import Billing from './Billing'
import Menu from './Menu'
import Checkout from './Checkout'
import Sales from './Sales'
//import "./styles/app.css"

function App() {


  return (
    <>
       <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path='/register' element={<Signup></Signup>}></Route>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/menu' element={<Menu></Menu>}></Route>
            <Route path='/home' element={<Home></Home>}></Route>
            <Route path='/billing' element={<Billing></Billing>}></Route>
            <Route path='/additem' element={<Additem></Additem>}></Route>
            <Route path='/updateItem/:id' element={<UpdateItem></UpdateItem>}></Route>
            <Route path='/checkout' element={<Checkout></Checkout>}></Route>
            <Route path='/sales' element={<Sales></Sales>}></Route>
          </Routes>
       </BrowserRouter> 
    </>
  )
}

export default App

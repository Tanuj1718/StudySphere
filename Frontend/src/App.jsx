import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import UserList from './components/Dashboard';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreatePost from './components/CreatePost';

function App() {
  return (
    <Router>
        <div className="container mx-auto p-4"> 
        <Navbar />
      <Routes>
        <Route path="/posts" element={<Home />} />
        <Route path="/post" element={<CreatePost/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<UserList />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;

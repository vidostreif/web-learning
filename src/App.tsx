// import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.scss'
import CssTask from './pages/cssTask'
import Home from './pages/home'

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <section className="main">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/csstask" element={<CssTask />} />
            <Route path="/csstask/:id" element={<CssTask />} />
          </Routes>
        </BrowserRouter>
      </section>
      <footer></footer>
    </div>
  )
}

export default App

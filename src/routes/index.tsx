import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { routes } from './routes'
import Paint from '../pages/Paint'

function Router() {
    return (
        <Routes>
            <Route path={routes.ROOT} element={<Paint/>} />
        </Routes>
    )
}

export default Router
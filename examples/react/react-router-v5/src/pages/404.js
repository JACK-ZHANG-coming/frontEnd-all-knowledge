import React from 'react';
import { Link } from 'react-router-dom';

function page404(props) {

    return (
        <>
            <h1>404</h1>
            <Link to="/">回首页</Link>
        </>
    );
}

export default page404;
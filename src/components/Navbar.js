import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
    

return(
    <div className="Nav main">
        <Link className="Nav menuOption" to="/add">
			<div className="tab">Add</div>
		</Link>
				
		<Link className="Nav menuOption" to="/create">
			<div className="tab">Create</div>
		</Link>
		
		<Link className="Nav menuOption" to="/custom">
			<div className="tab">Add Custom</div>
		</Link>
		
		<Link className="Nav menuOption" to="/remove">
			<div className="tab">Remove</div>
		</Link>
		<Link className="Nav menuOption" to="/search">
			<div className="tab">Search</div>
		</Link>
    </div>
    )
}
    


export default Navbar;
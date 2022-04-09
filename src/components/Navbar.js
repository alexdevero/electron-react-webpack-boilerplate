import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
    
const [hist, setHist] = React.useState([]);

return(
    <div className="Nav main">
        <NavLink className="Nav menuOption" to="/add">
			Add
		</NavLink>
				
		<NavLink className="Nav menuOption" to="/create">
			Create
		</NavLink>
		
		<NavLink className="Nav menuOption" to="/custom">
			Add Custom
		</NavLink>
		
		<NavLink className="Nav menuOption" to="/remove">
			Remove
		</NavLink>
		<NavLink className="Nav menuOption" to="/search">
			Search
		</NavLink>
    </div>
    )
}
    


export default Navbar;
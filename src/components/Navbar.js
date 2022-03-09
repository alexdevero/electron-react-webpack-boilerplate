import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
    

return(
    <div class="Nav main">
        <Link class="Nav menuOption" to="/add">
			<div class="tab">ADD</div>
		</Link>
				
		<Link class="Nav menuOption" to="/search">
			<div class="tab">SEARCH</div>
		</Link>
    </div>
    )
}
    


export default Navbar;
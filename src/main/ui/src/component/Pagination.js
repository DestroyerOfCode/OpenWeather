import React, { Component } from 'react'

class Pagination extends Component {
  render(){
    console.log("som v render pagination")
    const { itemsPerPage, totalItems } = this.props;

    return (
      <nav>
        <ul className='pagination'>
          {[...new Array(Math.ceil(totalItems / itemsPerPage)).keys()].map(number => (
            <li key={number} className='page-item'>
                <a onClick={() => {this.props.paginate(number+1)}} className='page-link'>
              {number+1}
            </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
export default Pagination
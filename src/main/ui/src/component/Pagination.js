import React, { Component } from 'react'

class Pagination extends Component {
  render(){
    const { itemsPerPage, totalItems } = this.props;

    return (
      <nav>
        <ul className='pagination'>
          {[...new Array(Math.ceil(totalItems / itemsPerPage)).keys()].map(number => (
            <li key={number} className='page-item'>
                <a onClick={() => {this.props.paginate(number+1)}} href='!#' className='page-link'>
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
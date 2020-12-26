import React, {Component} from 'react';

class Pagination extends Component {
    constructor(props) {
        super(props)
        this.state = {
            itemsPerPage : 0,
            totalItems : 0,
            currentPage : 0,
            paginate : 0,
            pageNumbers :[],
        }
    }

  
 fillPageNumber() { 
   this.state.pageNumbers = []
    for (let i = 1; i <= Math.ceil(this.props.totalItems / this.props.itemsPerPage); i++) {
        this.state.pageNumbers.push(i);
      }
    }
 render(){
    this.fillPageNumber()
      console.log("currentPage: " + this.props.currentPage)

  return (
    <nav>
      <ul className='pagination'>
        {this.state.pageNumbers.map(number => (
            console.log("number:" + number),
          <li key={number} className='page-item'>
            <a onClick={() => {this.props.paginate(number)}} href='!#' className='page-link'>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
        }
}
export default Pagination;
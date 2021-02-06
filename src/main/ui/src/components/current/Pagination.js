import React, { Component } from 'react'
// import '../../styles/current/Pagination.scss'
import {getFirstAndPrevious, getPageNumbers, getLastAndNext, calculateLastPageNumber } from "../../businessLogic/PaginationLogic";

class Pagination extends Component {
  render(){
    console.log("som v render pagination")
    const { itemsPerPage, currentPage, totalItems, showPages } = this.props;
    const lastPage = calculateLastPageNumber(itemsPerPage, totalItems)
    let pageArray = [];

    //here I will will pageArray with <li> tags of numbers
    getFirstAndPrevious(currentPage, lastPage, pageArray, this.props);
    getPageNumbers(currentPage, lastPage, showPages, pageArray, this.props);
    getLastAndNext(currentPage, lastPage, pageArray, this.props);

    return (
        <ul className="pagination">{pageArray}</ul>
    );
  }
}
export default Pagination
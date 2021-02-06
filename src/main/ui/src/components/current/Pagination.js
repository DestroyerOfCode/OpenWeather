import React, { Component } from 'react'
// import '../../styles/current/Pagination.scss'

class Pagination extends Component {
  render(){
    console.log("som v render pagination")
    const { itemsPerPage, currentPage, totalItems, showPages } = this.props;
    const lastPage = this.calculateLastPageNumber(itemsPerPage, totalItems)

    return (
      <nav className="pagination">
        {this.getFirstAndPrevious(currentPage, lastPage, this.props)}
        {this.getPageNumbers(currentPage, lastPage, showPages, this.props)}
        {this.getLastAndNext(currentPage, lastPage, this.props)}
      </nav>
    );
  }

  calculateLastPageNumber(itemsPerPage, totalItems){
    return (Math.ceil(totalItems *(1/ itemsPerPage) ))
  }

  getPagesWhenCurrentIsInStart(showPages, currentPage, lastPage, props){
    return (
      [...new Array(showPages).keys()].map((number, idx, elements) => {
        console.log("3. showPages: " + showPages + " currentPage: " + currentPage + " lastPage: " + lastPage + " idx: " + idx + " number: " + number)
        if (idx === showPages-1){
          return (
            <ul className='pagination'>
              
              <li key={"dotsBeginning"} className='page-item'>
                <a className='page-link'>
                  {"..."}
                </a>
              </li>
              <li key={lastPage} className='page-item'>
                <a onClick={() => {props.paginate(lastPage)}} className='page-link'>
                  {lastPage}
                </a>
              </li>
            </ul>
          )
        }
        if (currentPage + 1  < 1){
          return (
            <li key={2} className='page-item'>
              <a onClick={() => {props.paginate(2)}} className='page-link'>
                {2}
              </a>
            </li>
          )
        }
        if (currentPage < 1){
          return (
            <li key={1} className='page-item'>
              <a onClick={() => {props.paginate(1)}} className='page-link'>
                {1}
              </a>
            </li>
          )
        }

        else{
          return (
            <li key={number + 1} className='page-item'>
              <a onClick={() => {props.paginate(number + 1)}} className='page-link'>
                {number + 1}
              </a>
            </li>
          )            
        }
      })
    )
  }

  getPagesWhenCurrentIsInMiddle(showPages, currentPage, lastPage, props){
    return (
      <ul className='pagination'>{

        [...new Array(showPages).keys()].map((number, idx, elements) => {
          console.log("1. showPages: " + showPages + " currentPage: " + currentPage + " lastPage: " + lastPage + " idx: " + idx + " number: " + number)
          if (idx === 0){
            return (
              <ul className='pagination'>
                <li key={number} className='page-item'>
                  <a onClick={() => {props.paginate(1, 1)}} className='page-link'>
                    {"1"}
                  </a>
                </li>
                <li key={"dotsBeginning"} className='page-item'>
                  <a className='page-link'>
                    {"..."}
                  </a>
                </li>
              
              </ul>
            )
          }
          if(number === showPages -1){
            return (
              <ul className='pagination'>
                <li key={"dotsEnd"} className='page-item'>
                  <a className='page-link'>
                    {"..."}
                  </a>
                </li>
              <li key={number} className='page-item'>
                <a onClick={() => {props.paginate(lastPage, lastPage)}} className='page-link'>
                  {lastPage}
                </a>
              </li>
              </ul>
            )
          }
        
          console.log("currentPage: " + currentPage + " lastPage: " + lastPage)
        
          return (
            <li key={number+currentPage - 2} className='page-item'>
              <a onClick={() => {props.paginate(number+currentPage - 2, lastPage)}} className='page-link'>
                {number+currentPage - 2}
              </a>
            </li>
          )
          })
    }
    </ul>
    )
  }

  getPagesWhenCurrentIsInEnd(showPages, currentPage, lastPage, props){
    return (
      [...new Array(showPages).keys()].map((number, idx, elements) => {
        console.log("2. showPages: " + showPages + " currentPage: " + currentPage + " lastPage: " + lastPage + " idx: " + idx + " number: " + number)
        if (idx === 0){
          return (
            <ul className='pagination'>
              <li key={number} className='page-item'>
                <a onClick={() => {props.paginate(1, 1)}} className='page-link'>
                  {"1"}
                </a>
              </li>
              <li key={"dotsEnd"} className='page-item'>
                <a className='page-link'>
                  {"..."}
                </a>
              </li>
            
            </ul>
          )
        }
        if (currentPage +1  < lastPage){
          return (
            <li key={number+currentPage - 2} className='page-item'>
              <a onClick={() => {props.paginate(number+currentPage - 2, lastPage)}} className='page-link'>
                {number+currentPage - 2}
              </a>
            </li>
          )
        }
        if (currentPage  < lastPage){
          return (
            <li key={number+currentPage - 3} className='page-item'>
              <a onClick={() => {props.paginate(number+currentPage - 3, lastPage)}} className='page-link'>
                {number+currentPage - 3}
              </a>
            </li>
          )
        }

        else{
          return (
            <li key={number+currentPage-4} className='page-item'>
              <a onClick={() => {props.paginate(number+currentPage-4, lastPage)}} className='page-link'>
                {number+currentPage-4}
              </a>
            </li>
          )            
        }
      })
    )
  }

  getPagesWithFewerThan10Pages(lastPage, props){
    return (
      <ul className='pagination'>{
        [...new Array(lastPage).keys()].map((number, idx, elements) => {
        return (
          <li key={number} className='page-item'>
            <a onClick={() => {props.paginate(number+1, lastPage)}} className='page-link'>
              {number+1}
            </a>
          </li>
            ) 
        })
    }
    </ul>
    )
  }
  getPageNumbers(currentPage, lastPage, showPages, props){

    //only when there are more than 10 pages do I want dots
    if (lastPage <= 10)
      return this.getPagesWithFewerThan10Pages(lastPage, props)

    //this is for when current page is in middle
    // 2 is for dots
    if ((currentPage - showPages + 3> 1) && (currentPage + 2 < lastPage))
    return this.getPagesWhenCurrentIsInMiddle(showPages, currentPage, lastPage, props)  

    //this is for when current page is in the beginning
    if((currentPage + showPages + 1 < lastPage) && (currentPage + 2 >= 1))
      return this.getPagesWhenCurrentIsInStart(showPages, currentPage, lastPage, props)

    //this is for when current page is in the end
    if((currentPage + showPages + 1 > 1) && (currentPage + 2 >= lastPage))
      return this.getPagesWhenCurrentIsInEnd(showPages, currentPage, lastPage, props)

  }

  getFirstAndPrevious(currentPage, lastPage, props){
    return (
      <ul className='pagination'>
        <li key={"first"} className='page-item'>
          <a onClick={() => {props.paginate(1, lastPage)}} className='page-link'>
            {"<<"}
          </a>
        </li>
        <li key={"previous"} className='page-item'>
          <a onClick={() => {  if (currentPage -1 !== 0) return props.paginate(currentPage-1, lastPage)}} className='page-link'>
            {"<"}
          </a>
        </li>
      </ul>
    )
  }

  getLastAndNext(currentPage, lastPage, props){
    return (
      <ul className='pagination'> 
        <li key={"next"} className='page-item'>
          <a onClick={() => {if (currentPage !== lastPage) {props.paginate(currentPage+1, lastPage)}}} className='page-link'>
            {">"}
          </a>
        </li>

        <li key={"last"} className='page-item'>
          <a onClick={() => {props.paginate(lastPage, lastPage)}} className='page-link'>
            {">>"}
          </a>
        </li>
     </ul>
  )
  }
}
export default Pagination
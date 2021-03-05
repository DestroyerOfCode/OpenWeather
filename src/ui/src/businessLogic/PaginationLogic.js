import { nanoid } from "nanoid";

//at this moment middle and last work for only 5 range
//I dont know now how to fix it but it isnt so important now
export const getFirstAndPrevious = (
  currentPage,
  lastPage,
  pageArray,
  props
) => {
  pageArray.push(
    <li key={nanoid()} className="page-item">
      <a href="/#"
        onClick={() => {
          props.paginate(1, lastPage);
        }}
        className="page-link"
      >
        {"<<"}
      </a>
    </li>
  );
  pageArray.push(
    <li key={nanoid()} className="page-item">
      <a href="/#"
        onClick={() => {
          if (currentPage - 1 !== 0)
            return props.paginate(currentPage - 1, lastPage);
        }}
        className="page-link"
      >
        {"<"}
      </a>
    </li>
  );
};

export const getLastAndNext = (currentPage, lastPage, pageArray, props) => {
  pageArray.push(
    <li key={nanoid()} className="page-item">
      <a href="/#"
        onClick={() => {
          if (currentPage !== lastPage) {
            props.paginate(currentPage + 1, lastPage);
          }
        }}
        className="page-link"
      >
        {">"}
      </a>
    </li>
  );

  pageArray.push(
    <li key={nanoid()} className="page-item">
      <a href="/#"
        onClick={() => {
          props.paginate(lastPage, lastPage);
        }}
        className="page-link"
      >
        {">>"}
      </a>
    </li>
  );
};

export const getPageNumbers = (
  currentPage,
  lastPage,
  range,
  pageArray,
  props
) => {
  //only when there are more than 10 pages do I want dots
  if (lastPage <= 10) 
    getPagesWithFewerThan10Pages(lastPage, pageArray, props);

  //this is for when current page is in middle
  // 2 is for dots
  else if (currentPage - range + 3 > 1 && currentPage + 2 < lastPage)
    getPagesWhenCurrentIsInMiddle(
      range,
      currentPage,
      lastPage,
      pageArray,
      props
    );

  //this is for when current page is in the beginning
  else if (currentPage + range + 1 < lastPage && currentPage + 2 >= 1)
    getPagesWhenCurrentIsInStart(
      range,
      currentPage,
      lastPage,
      pageArray,
      props
    );

  //this is for when current page is in the end
  else if (currentPage + range + 1 > 1 && currentPage + 2 >= lastPage)
    getPagesWhenCurrentIsInEnd(
      range,
      currentPage,
      lastPage,
      pageArray,
      props
    );
};

export const calculateLastPageNumber = (itemsPerPage, totalItems) => {
  return Math.ceil(totalItems * (1 / itemsPerPage));
};

const getPagesWhenCurrentIsInStart = (
  showPages,
  currentPage,
  lastPage,
  pageArray,
  props
) => {
  [...new Array(showPages).keys()].forEach((number, idx) => {
    if (idx === showPages - 1) {
      pageArray.push(
        <li key={nanoid()} className="disabled">
          <a href="/#" className="page-link">{"..."}</a>
        </li>
      );
      pageArray.push(
        <li key={nanoid()} className="page-item">
          <a href="/#"
            onClick={() => {
              props.paginate(lastPage);
            }}
            className="page-link"
          >
            {lastPage}
          </a>
        </li>
      );
      return;
    }
    if (currentPage + 1 < 1) {
      pageArray.push(
        <li key={nanoid()} className="page-item">
          <a href="/#"
            onClick={() => {
              props.paginate(2);
            }}
            className="page-link"
          >
            {2}
          </a>
        </li>
      );
      return;
    }
    if (currentPage < 1) {
      pageArray.push(
        <li key={nanoid()} className="page-item">
          <a href="/#"
            onClick={() => {
              props.paginate(1);
            }}
            className="page-link"
          >
            {1}
          </a>
        </li>
      );
      return;
    } else {
      pageArray.push(
        <li key={nanoid()} className="page-item">
          <a href="/#"
            onClick={() => {
              props.paginate(number + 1);
            }}
            className="page-link"
          >
            {number + 1}
          </a>
        </li>
      );
      return;
    }
  });
};
const getPagesWhenCurrentIsInMiddle = (
  showPages,
  currentPage,
  lastPage,
  pageArray,
  props
) => {
  [...new Array(showPages).keys()].forEach((number, idx) => {
    if (idx === 0) {
      pageArray.push(
        <li key={nanoid()} className="page-item">
          <a href="/#"
            onClick={() => {
              props.paginate(1, 1);
            }}
            className="page-link"
          >
            {"1"}
          </a>
        </li>
      );
      pageArray.push(
        <li key={nanoid()} className="disabled">
          <a href="/#" className="page-link">{"..."}</a>
        </li>
      );
      return;
    }
    if (number === showPages - 1) {
      pageArray.push(
        <li key={nanoid()} className="disabled">
          <a href="/#" className="page-link">{"..."}</a>
        </li>
      );
      pageArray.push(
        <li key={nanoid()} className="page-item">
          <a href="/#"
            onClick={() => {
              props.paginate(lastPage, lastPage);
            }}
            className="page-link"
          >
            {lastPage}
          </a>
        </li>
      );
      return;
    }

    pageArray.push(
      <li key={nanoid()} className="page-item">
        <a href="/#"
          onClick={() => {
            props.paginate(number + currentPage - showPages + 3, lastPage);
          }}
          className="page-link"
        >
          {number + currentPage - showPages + 3}
        </a>
      </li>
    );
    return;
  });
};

const getPagesWithFewerThan10Pages = (lastPage, pageArray, props) => {
  [...new Array(lastPage).keys()].forEach((number) => {
    pageArray.push(
      <li key={nanoid()} className="page-item">
        <a href="/#"
          onClick={() => {
            props.paginate(number + 1, lastPage);
          }}
          className="page-link"
        >
          {number + 1}
        </a>
      </li>
    );
  });
};

const getPagesWhenCurrentIsInEnd = (
  showPages,
  currentPage,
  lastPage,
  pageArray,
  props
) => {
  return [...new Array(showPages).keys()].forEach((number, idx) => {
    if (idx === 0) {
      pageArray.push(
        <li key={nanoid()} className="page-item">
          <a href="/#"
            onClick={() => {
              props.paginate(1, 1);
            }}
            className="page-link"
          >
            {"1"}
          </a>
        </li>
      );
      pageArray.push(
        <li key={nanoid()} className="disabled">
          <a href="/#" className="page-link">{"..."}</a>
        </li>
      );
      return;
    }
    if (currentPage + 1 < lastPage) {
      pageArray.push(
        <li key={nanoid()} className="page-item">
          <a href="/#"
            onClick={() => {
              props.paginate(number + currentPage - 2, lastPage);
            }}
            className="page-link"
          >
            {number + currentPage - 2}
          </a>
        </li>
      );
      return;
    }
    if (currentPage < lastPage) {
      pageArray.push(
        <li key={nanoid()} className="page-item">
          <a href="/#"
            onClick={() => {
              props.paginate(number + currentPage - 3, lastPage);
            }}
            className="page-link"
          >
            {number + currentPage - 3}
          </a>
        </li>
      );
      return;
    } else {
      pageArray.push(
        <li key={nanoid()} className="page-item">
          <a href="/#"
            onClick={() => {
              props.paginate(number + currentPage - 4, lastPage);
            }}
            className="page-link"
          >
            {number + currentPage - 4}
          </a>
        </li>
      );
      return;
    }
  });
};

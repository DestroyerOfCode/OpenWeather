import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

function EnhancedTableHeader(props) {
    const { classes, order, orderBy, headCells, changeOrder } = props;
    return (
        <TableRow>
            {headCells.map((headCell) => {
                return (
                    <TableCell
                        width={'1000'}
                        key={headCell.id}
                        // align={headCell.notNumeric ? 'left' : 'right'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        padding="none"
                        onClick={() => changeOrder(headCell.id)}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() => changeOrder(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}></span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                );
            })}
        </TableRow>
    );
}

export default EnhancedTableHeader;

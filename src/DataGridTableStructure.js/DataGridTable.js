import { DataGrid } from '@mui/x-data-grid';
import React from 'react';

const DataGridTable = ({ columns, rows, height, initialSortingField, initialSortingType }) => {
    return (
        <DataGrid style={{ height: height}}
            rows={rows}
            columns={columns}
            pagesize={[10]}
            sortingOrder={['asc', 'desc']}
            sx={{
                boxShadow: 1,
                border: 1,
                fontSize: "12px",
                borderColor: "#001529",
                borderRadius: "0.2cm",
                '& .headerCellColor': {
                    backgroundColor: "#001529",
                    fontFamily: "system-ui",
                },
                '.MuiDataGrid-iconButtonContainer': {
                    visibility: 'visible',
                },
                '.MuiDataGrid-sortIcon': {
                    opacity: 'inherit !important',
                    color: 'white'
                },

                '.MuiDataGrid-columnHeaderTitle': {
                    // fontWeight: 'bold !important',
                    overflow: 'visible !important',
                    color: 'white',
                    fontFamily: "system-ui"
                },
                '.MuiTablePagination-root .MuiTablePagination-selectLabel': {
                    // fontWeight: 'bold !important',
                    color: '#001529',
                    fontFamily: "system-ui",
                },
                '.MuiTablePagination-root .MuiTablePagination-selectLabel': {
                    // fontWeight: 'bold !important',
                    marginTop: "0.4cm",
                    color: '#001529',
                    fontFamily: "system-ui",
                },
                '.MuiTablePagination-root .MuiTablePagination-displayedRows': {
                    marginTop: '0.4cm', // Set the margin-top property for "1–25 of 149"
                    color: '#001529',
                    fontFamily: "system-ui",
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-root': {
                    // fontWeight: 'bold !important',
                    overflow: 'visible !important',
                    color: "#001529",
                    fontSize: "smaller",
                    fontFamily: "system-ui",
                },
                '.MuiDataGrid-columnHeaders': {
                    backgroundColor: "#001529 !important",
                    fontFamily: "system-ui",
                },
            }}
            // slots={slots_For_History_Table}
            slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}//, csvOptions: { disableToolbarButton: true } 
            showCellVerticalBorder
            showColumnVerticalBorder
            initialState={{
                sorting: {
                    sortModel: [{ field: initialSortingField, sort: initialSortingType }],
                },
                pagination: { paginationModel: { pageSize: 10 } },
                density: "compact"
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
        />
    )
}

export default DataGridTable;

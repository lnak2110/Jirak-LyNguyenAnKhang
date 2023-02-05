import { useState } from 'react';
import { Member } from '../redux/reducers/projectReducer';
import { theme } from '../App';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

type ProjectsRowsType = {
  id: number;
  projectName: string;
  categoryName: string;
  creator: string;
  members: Member[];
};

type UsersRowsType = {
  userId: number;
  name: string;
  avatar: string;
  phoneNumber: string;
  email: string;
};

type MUIDataGridProps = {
  columns: GridColDef[];
  rows: ProjectsRowsType[] | UsersRowsType[];
  initialPageSizeNumber: number;
  rowId?: string;
};

const MUIDataGrid = ({
  columns,
  rows,
  initialPageSizeNumber,
  rowId,
}: MUIDataGridProps) => {
  const [pageSize, setPageSize] = useState(initialPageSizeNumber);

  return (
    <DataGrid
      rows={rows ?? []}
      columns={columns}
      getRowId={(row) => row[rowId!]}
      autoHeight
      checkboxSelection
      disableSelectionOnClick
      rowsPerPageOptions={[10, 20, 50, 100]}
      pageSize={pageSize}
      onPageSizeChange={(newPageSizeNumber: number) =>
        setPageSize(newPageSizeNumber)
      }
      disableDensitySelector
      components={{ Toolbar: GridToolbar }}
      componentsProps={{
        toolbar: {
          csvOptions: { disableToolbarButton: true },
          printOptions: { disableToolbarButton: true },
          showQuickFilter: true,
        },
      }}
      sx={{
        '	.MuiDataGrid-columnHeaders': {
          backgroundColor: theme.palette.grey[200],
        },
      }}
    />
  );
};

export default MUIDataGrid;

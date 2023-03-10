import { useState } from 'react';
import { theme } from '../App';
import { Creator, Member } from '../types/projectTypes';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import {
  DataGrid,
  GridColDef,
  GridMoreVertIcon,
  GridToolbar,
} from '@mui/x-data-grid';

type ProjectsRowsType = {
  id: number;
  projectName: string;
  categoryName: string;
  creator: Creator;
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

const MoreActionsIconTip = () => {
  return (
    <Tooltip title="More actions" placement="left">
      <GridMoreVertIcon />
    </Tooltip>
  );
};

const MUIDataGrid = ({
  columns,
  rows,
  initialPageSizeNumber,
  rowId,
}: MUIDataGridProps) => {
  const [pageSize, setPageSize] = useState(initialPageSizeNumber);

  return (
    //  minWidth: Prevent MUI useResizeContainer error
    <Box sx={{ minWidth: '100px' }}>
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
        components={{
          Toolbar: GridToolbar,
          MoreActionsIcon: MoreActionsIconTip,
        }}
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
    </Box>
  );
};

export default MUIDataGrid;

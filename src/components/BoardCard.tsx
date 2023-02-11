import { ReactNode } from 'react';
import { theme } from '../App';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

type BoardCardChipType = {
  label: string;
};

type BoardCardProps = {
  children: ReactNode;
};

export const BoardCardChip = ({ label }: BoardCardChipType) => {
  return <Chip label={label} />;
};

const BoardCard = ({ children }: BoardCardProps) => {
  return (
    <Card sx={{ bgcolor: theme.palette.grey[100] }}>
      <Stack spacing={1} sx={{ p: 1, alignItems: 'flex-start' }}>
        {children}
      </Stack>
    </Card>
  );
};

export default BoardCard;

import { ReactNode } from 'react';
import { theme } from '../App';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

type BoardCardProps = {
  children: ReactNode;
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

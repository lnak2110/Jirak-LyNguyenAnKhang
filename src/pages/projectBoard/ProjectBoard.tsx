import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import BoardCard, { BoardCardChip } from '../../components/BoardCard';

const ProjectBoard = () => {
  return (
    <Grid container spacing={2}>
      <Grid container item xs={12}>
        <Grid item xs={3}>
          <Typography variant="h4" component="h1">
            Board
          </Typography>
        </Grid>

        <Grid item xs={9}></Grid>
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={3}>
          <BoardCard>
            {
              <>
                <BoardCardChip label="BACKLOG" />
                <Button fullWidth startIcon={<AddIcon />}>
                  Create
                </Button>
              </>
            }
          </BoardCard>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </Grid>
  );
};

export default ProjectBoard;

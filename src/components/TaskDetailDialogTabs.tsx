import { cloneElement, ReactElement, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

type TaskDetailDialogTabsProps = {
  taskDetailTabContent: ReactElement;
  commentsTabContent: ReactElement;
  handleCloseModal?: () => void;
};

type TabsName = {
  tabName: 'Task Detail' | 'Comments';
};

const TaskDetailDialogTabs = ({
  taskDetailTabContent,
  commentsTabContent,
  handleCloseModal,
}: TaskDetailDialogTabsProps) => {
  const [tabValue, setTabValue] = useState<TabsName>(
    'Task Detail' as unknown as TabsName
  );

  const handleChange = (_event: React.SyntheticEvent, newValue: TabsName) => {
    setTabValue(newValue);
  };

  return (
    <>
      <AppBar color="inherit" position="sticky">
        <Tabs
          value={tabValue}
          onChange={handleChange}
          centered
          TabIndicatorProps={{
            style: { transition: 'none' },
          }}
        >
          <Tab value="Task Detail" label="Task Detail" />
          <Tab value="Comments" label="Comments" />
        </Tabs>
      </AppBar>
      {tabValue === ('Task Detail' as unknown as TabsName)
        ? cloneElement(taskDetailTabContent, { handleCloseModal })
        : commentsTabContent}
    </>
  );
};

export default TaskDetailDialogTabs;

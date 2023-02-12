import { cloneElement, ReactElement } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
  bindDialog,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';

type DialogModalProps = {
  buttonOpen: ReactElement;
  children: ReactElement;
  popupId: string;
  title: string;
  ariaLabel: string;
  preventCloseBackdrop?: boolean;
};

const DialogModal = ({
  buttonOpen,
  children,
  popupId,
  title,
  ariaLabel,
  preventCloseBackdrop,
}: DialogModalProps) => {
  const dialogPopupState = usePopupState({
    variant: 'dialog',
    popupId: popupId,
  });

  return (
    <>
      {cloneElement(buttonOpen, { ...bindTrigger(dialogPopupState) })}
      <Dialog
        {...bindDialog(dialogPopupState)}
        PaperProps={{
          sx: {
            height: '90vh',
          },
        }}
        maxWidth="md"
        fullWidth
        aria-labelledby={ariaLabel}
        {...(preventCloseBackdrop && { disableEscapeKeyDown: true })}
        {...(preventCloseBackdrop && {
          onClose: (_e, reason) => {
            if (reason && reason === 'backdropClick') {
              return;
            }
          },
        })}
      >
        <DialogTitle
          id={ariaLabel}
          variant="h5"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {title}
          <IconButton
            aria-label="close"
            edge="end"
            onClick={dialogPopupState.close}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        {cloneElement(children, { onCloseModal: dialogPopupState.close })}
      </Dialog>
    </>
  );
};

export default DialogModal;

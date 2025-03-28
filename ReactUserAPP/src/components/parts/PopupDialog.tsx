
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const PopupDialog = ({ open, onClose, onConfirm, message }: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>אישור פעולה</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">ביטול</Button>
        <Button onClick={onConfirm} color="secondary">אישור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupDialog;

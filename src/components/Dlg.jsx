import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

export default function FormDialog({
  title,
  open,
  onClose,
  children,
  fullScreen,
}) {
  const [openDlg, setOpenDlg] = React.useState(open);

  const handleClose = () => {
    setOpenDlg(false);
    onClose();
  };

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={openDlg} onClose={handleClose}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </div>
  );
}

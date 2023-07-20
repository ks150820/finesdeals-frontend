import React, { Fragment } from "react";
import { Modal, ButtonToolbar, Button } from "rsuite";
import RemindIcon from "@rsuite/icons/legacy/Remind";

const Alert = ({ handleOpen, handleClose, message, open }) => {
  return (
    <Fragment>
      <Modal
        backdrop="static"
        role="alertdialog"
        open={open}
        onClose={handleClose}
        size="xs"
      >
        <Modal.Body>
          <RemindIcon style={{ color: "#ffb300", fontSize: 24, marginRight: 10 }} />
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Alert;

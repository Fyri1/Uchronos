import { useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import ModalsContext from '../../contex/modalsContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EventModal = () => {
  const { anchorEl, setAnchorEl } = useContext(ModalsContext);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
//   console.log(anchorEl);
  const id = open ? 'simple-popover' : undefined;
//   console.log(id, open)
  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </div>
  );
};

export default EventModal;

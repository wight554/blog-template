import { useState } from 'preact/hooks';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';

import * as S from './styles';

const settings = ['Profile', 'Logout'];

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpenUserMenu = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <S.Toolbar>
        <Typography variant="h6" component="div">
          Blog demo
        </Typography>
        <div>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar>V</Avatar>
          </IconButton>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </S.Toolbar>
    </AppBar>
  );
};

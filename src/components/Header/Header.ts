import { Tooltip, Link as MuiLink, Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { Link } from 'react-router-dom';

import { User } from '@src/interfaces/model/User';

import * as S from './styles';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header: FunctionComponent<HeaderProps> = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpenUserMenu = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleCloseUserMenu();
  };

  return html`
    <${AppBar} position="static">
      <${S.Toolbar}>
        <${MuiLink} component=${Link} to="/" underline="none" color="inherit" variant="h6">
          Blog demo
        <//>
        <${Box}>
          <${Tooltip} title="Open settings">
            <${IconButton} aria-label="open user menu" onClick=${handleOpenUserMenu} sx=${{ p: 0 }}>
              <${Avatar}>${user ? user.username.charAt(0).toUpperCase() : 'U'}<//>
            <//>
          <//>
          <${Menu}
            sx=${{ mt: '45px' }}
            id="menu-appbar"
            anchorEl=${anchorEl}
            anchorOrigin=${{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin=${{
              vertical: 'top',
              horizontal: 'right',
            }}
            open=${Boolean(anchorEl)}
            onClose=${handleCloseUserMenu}
          >
            <${MenuItem} onClick=${handleCloseUserMenu}>
              <${Typography} textAlign="center">Profile<//>
            <//>
            <${MenuItem} onClick=${handleLogout}>
              <${Typography} textAlign="center">Logout<//>
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
};

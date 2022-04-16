import {
  Tooltip,
  Link as MuiLink,
  Box,
  CircularProgress,
  AppBar,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { html } from 'htm/preact';
import { StatusCodes } from 'http-status-codes';
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { Link } from 'react-router-dom';
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil';

import { httpClient } from '@src/api/httpClient';
import { HttpError } from '@src/api/httpError';
import { promiser } from '@src/api/promiser';
import { User } from '@src/interfaces/model/User';
import { userInfoState } from '@src/store/userState';

import { Backdrop } from '../Backdrop';

import * as S from './styles';

interface HeaderProps {
  user: User | null;
}

export const Header: FunctionComponent<HeaderProps> = () => {
  const userLoadable = useRecoilValueLoadable(userInfoState);
  const user = userLoadable.state === 'hasValue' && userLoadable.contents;

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenUserMenu = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = useRecoilCallback(
    ({ set }) =>
      async () => {
        setLoading(true);

        const [data, error] = await promiser(httpClient.post('/api/v1/auth/logout'));

        if (error instanceof HttpError && error.code === StatusCodes.UNAUTHORIZED) {
          console.error(error);
        } else if (error) {
          throw error;
        }

        if (data) set(userInfoState, null);

        setLoading(false);
      },
    [],
  );

  const handleLogoutClick = () => {
    handleLogout();
    handleCloseUserMenu();
  };

  return html`
    <${AppBar} position="static">
      <${Backdrop} open=${loading}>
        <${CircularProgress} color="inherit" />
      <//>
      <${S.Toolbar}>
        <${MuiLink} component=${Link} to="/" underline="none" color="inherit" variant="h6">
          Blog demo
        <//>
        <${Box}>
          <${Tooltip} title="Open settings">
            <${IconButton} aria-label="open user menu" onClick=${handleOpenUserMenu} sx=${{ p: 0 }}>
              <${Avatar}> ${user ? user.username.charAt(0).toUpperCase() : 'U'} <//>
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
            ${user
              ? html`
                  <${MenuItem} onClick=${handleCloseUserMenu}>
                    <${Typography} textAlign="center">Profile<//>
                  <//>
                  <${MenuItem} onClick=${handleLogoutClick}>
                    <${Typography} textAlign="center">Logout<//>
                  <//>
                `
              : html`
                  <${MenuItem} component=${Link} to="/login" onClick=${handleCloseUserMenu}>
                    Login
                  <//>
                  <${MenuItem} component=${Link} to="/sign-up" onClick=${handleCloseUserMenu}>
                    Sign-up
                  <//>
                `}
          <//>
        <//>
      <//>
    <//>
  `;
};

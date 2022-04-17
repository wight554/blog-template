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
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { Link } from 'react-router-dom';
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil';

import { logoutUser } from '@src/api/user';
import { User } from '@src/interfaces/model/User';
import { snackbarState } from '@src/store/snackbarState';
import { userInfoState } from '@src/store/userState';

import * as S from './styles';

interface HeaderProps {
  user: User | null;
}

export const Header: FunctionComponent<HeaderProps> = () => {
  const userLoadable = useRecoilValueLoadable(userInfoState);

  const user = userLoadable.state === 'hasValue' ? userLoadable.contents : null;

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

        const [data, error] = await logoutUser();

        setLoading(false);

        if (data) set(userInfoState, null);
        if (error) set(snackbarState, { open: true, message: error.message });
      },
    [],
  );

  const handleLogoutClick = () => {
    handleLogout();
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
            <${Box} sx=${{ m: 1, position: 'relative' }}>
              <${IconButton}
                aria-label="open user menu"
                onClick=${handleOpenUserMenu}
                sx=${{ p: 0 }}
              >
                <${Avatar}> ${user ? user.username.charAt(0).toUpperCase() : 'U'} <//>
              <//>
              ${loading &&
              html`
                <${CircularProgress}
                  size=${52}
                  sx=${{
                    position: 'absolute',
                    top: -6,
                    left: -6,
                    zIndex: 1,
                  }}
                  color="inherit"
                />
              `}
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

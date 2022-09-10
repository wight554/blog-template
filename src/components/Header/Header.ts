import { AppBar, Avatar, Box, Link as MuiLink, MenuItem, Tooltip } from '@mui/material';
import { html } from 'htm/preact';
import { useState } from 'preact/hooks';
import { Link } from 'react-router-dom';
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil';

import { logoutUser } from '#src/services/user.js';
import { snackbarState } from '#src/store/snackbarState.js';
import { userInfoState } from '#src/store/userState.js';

import * as S from './styles.js';

interface UserMenuItem {
  title: string;
  action: () => void;
}

interface AuthMenuItem extends UserMenuItem {
  link: string;
}

interface MenuSettings {
  user: Array<UserMenuItem>;
  auth: Array<AuthMenuItem>;
}

export const Header = () => {
  const { state: getUserState, contents: user } = useRecoilValueLoadable(userInfoState);

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [loading, setLoading] = useState(false);

  const isGetUserSuccess = !!(getUserState === 'hasValue' && user);

  const handleOpenUserMenu = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = useRecoilCallback(
    ({ set }) =>
      async () => {
        handleCloseUserMenu();

        setLoading(true);

        const [, error] = await logoutUser();

        setLoading(false);

        if (error) return set(snackbarState, { open: true, message: error.message });

        set(userInfoState, null);
      },
    [],
  );

  const settings: MenuSettings = {
    auth: [
      { title: 'Login', action: handleCloseUserMenu, link: '/login' },
      { title: 'Sign-up', action: handleCloseUserMenu, link: '/sign-up' },
    ],
    user: [
      { title: 'Profile', action: handleCloseUserMenu },
      { title: 'Logout', action: handleLogoutClick },
    ],
  };

  return html`
    <${AppBar} position="fixed">
      <${S.Toolbar}>
        <${MuiLink}
          component=${Link}
          to="/"
          underline="none"
          color="inherit"
          variant="h6"
          sx=${{ textTransform: 'uppercase' }}
        >
          Blog demo
        <//>
        <${Box}>
          <${Tooltip} title="Open settings">
            <${S.AvatarWrapper}>
              <${S.AvatarButton}
                aria-label="open user menu"
                onClick=${handleOpenUserMenu}
                disabled=${loading}
              >
                <${Avatar}> ${isGetUserSuccess ? user.username.charAt(0).toUpperCase() : 'U'} <//>
              <//>
              ${loading && html`<${S.AvatarCircularProgress} size=${52} color="inherit" />`}
            <//>
          <//>
          <${S.UserMenu}
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
            ${settings.user.map(
              (item) =>
                html`
                  <${MenuItem}
                    onClick=${item.action}
                    key=${item.title}
                    sx=${{ display: !isGetUserSuccess && 'none' }}
                  >
                    ${item.title}
                  <//>
                `,
            )}
            ${settings.auth.map(
              (item) => html`
                <${MenuItem}
                  component=${Link}
                  to=${item.link}
                  onClick=${item.action}
                  key=${item.title}
                  sx=${{ display: isGetUserSuccess && 'none' }}
                >
                  ${item.title}
                <//>
              `,
            )}
          <//>
        <//>
      <//>
    <//>
  `;
};

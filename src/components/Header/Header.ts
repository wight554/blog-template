import { AppBar, Avatar, Box, Link as MuiLink, MenuItem, Tooltip } from '@mui/material';
import { html } from 'htm/preact';
import { useCallback, useState } from 'preact/hooks';
import { Link } from 'react-router-dom';

import { useUser, useUserLogoutMutation } from '#src/services/user.js';

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
  const { data: user } = useUser();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpenUserMenu = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const logoutMutation = useUserLogoutMutation(handleCloseUserMenu);

  const handleLogoutClick = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  console.log(logoutMutation.isLoading, logoutMutation.status);

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
                aria-busy="${logoutMutation.isLoading}"
                onClick=${handleOpenUserMenu}
                disabled=${logoutMutation.isLoading}
              >
                <${Avatar}> ${user ? user.username.charAt(0).toUpperCase() : 'U'} <//>
              <//>
              ${logoutMutation.isLoading &&
              html`<${S.AvatarCircularProgress} size=${52} color="inherit" />`}
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
                    sx=${{ display: !user && 'none' }}
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
                  sx=${{ display: user && 'none' }}
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

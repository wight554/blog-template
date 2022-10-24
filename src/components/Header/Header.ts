import { AppBar, Avatar, Box, Link as MuiLink, MenuItem, Tooltip } from '@mui/material';
import { html } from 'htm/preact';
import { useCallback, useState } from 'preact/hooks';
import { Link } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { useSWRConfig } from 'swr';

import { HttpError } from '#src/api/httpError.js';
import { promiser } from '#src/api/promiser.js';
import { logoutUser, UserRoutes, useUser } from '#src/services/user.js';
import { snackbarState } from '#src/store/snackbarState.js';

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
  const { user } = useUser();
  const { mutate } = useSWRConfig();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [loading, setLoading] = useState(false);

  const isGetUserSuccess = !!user;

  const handleOpenUserMenu = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleSetSnackBar = useRecoilCallback(
    ({ set }) =>
      (error: HttpError) => {
        handleCloseUserMenu();

        return set(snackbarState, { open: true, message: error.message });
      },
    [],
  );

  const handleLogoutClick = useCallback(async () => {
    setLoading(true);

    const [, error] = await promiser(
      mutate(
        UserRoutes.GET,
        async () => {
          const [, error] = await logoutUser();

          if (error) throw error;

          return null;
        },
        { revalidate: false },
      ),
    );

    setLoading(false);

    if (error instanceof HttpError) {
      handleSetSnackBar(error);
    }
    handleCloseUserMenu();
  }, [mutate, handleSetSnackBar]);

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

import { Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { html } from 'htm/preact';
import { useState } from 'react';

import * as S from './styles.js';

const settings = ['Profile', 'Logout'];

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpenUserMenu = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  return html`
    <${AppBar} position="static">
      <${S.Toolbar}>
        <${Typography} variant="h6" component="div"> Blog demo <//>
        <div>
          <${Tooltip} title="Open settings">
            <${IconButton} aria-label="open user menu" onClick=${handleOpenUserMenu} sx=${{ p: 0 }}>
              <${Avatar}>V<//>
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
            ${settings.map(
              (setting) => html`
              <${MenuItem} key=${setting} onClick=${handleCloseUserMenu}>
                <${Typography} textAlign="center">${setting}</${Typography}>
              </${MenuItem}>
            `,
            )}
          <//>
        </div>
      <//>
    <//>
  `;
};

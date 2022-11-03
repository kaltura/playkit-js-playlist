import {h} from 'preact';
import {A11yWrapper, OnClick} from '@playkit-js/common';
import {icons} from '../icons';
import * as styles from './plugin-button.scss';
import {ui} from 'kaltura-player-js';

const {Tooltip, Icon} = KalturaPlayer.ui.components;
const {withText, Text} = KalturaPlayer.ui.preacti18n;

const translates = ({isActive}: PluginButtonProps) => {
  return {
    label: isActive ? <Text id="playlist.hide_plugin">Hide Playlist</Text> : <Text id="playlist.show_plugin">Show Playlist</Text>
  };
};

interface PluginButtonProps {
  isActive: boolean;
  onClick: OnClick;
  label?: string;
}

export const PluginButton = withText(translates)(({isActive, onClick, ...otherProps}: PluginButtonProps) => {
  return (
    <Tooltip label={otherProps.label} type="bottom">
      <A11yWrapper onClick={onClick}>
        <button aria-label={otherProps.label} className={[ui.style.upperBarIcon, styles.pluginButton, isActive ? styles.active : ''].join(' ')}>
          <Icon
            id="playlist-plugin-button"
            height={icons.BigSize}
            width={icons.BigSize}
            viewBox={`0 0 ${icons.BigSize} ${icons.BigSize}`}
            path={icons.PLUGIN_ICON}
          />
        </button>
      </A11yWrapper>
    </Tooltip>
  );
});

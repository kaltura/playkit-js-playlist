import {h} from 'preact';
import {icons} from '../icons';
import * as styles from './plugin-button.scss';
import {ui} from '@playkit-js/kaltura-player-js';
import { pluginName } from "../../index";

const {Tooltip, Icon} = KalturaPlayer.ui.components;
const {withText, Text} = KalturaPlayer.ui.preacti18n;

const translates = ({isActive}: PluginButtonProps) => {
  return {
    label: isActive ? <Text id="playlist.hide_plugin">Hide Playlist</Text> : <Text id="playlist.show_plugin">Show Playlist</Text>
  };
};

interface PluginButtonProps {
  isActive: boolean;
  label?: string;
  setRef: (ref: HTMLButtonElement | null) => void;
}

export const PluginButton = withText(translates)(({isActive, setRef, ...otherProps}: PluginButtonProps) => {
  return (
    <Tooltip label={otherProps.label} type="bottom">
      <button
        type="button"
        data-testid={'playlist_pluginButton'}
        aria-label={otherProps.label}
        className={[ui.style.upperBarIcon, styles.pluginButton, isActive ? styles.active : ''].join(' ')}
        ref={node => {
          setRef(node);
        }}>
        <Icon
          id={pluginName}
          height={icons.BigSize}
          width={icons.BigSize}
          viewBox={`0 0 ${icons.BigSize} ${icons.BigSize}`}
          path={icons.PLUGIN_ICON}
        />
      </button>
    </Tooltip>
  );
});

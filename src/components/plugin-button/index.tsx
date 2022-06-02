import {h} from 'preact';
import {icons} from '../icons';
import * as styles from './plugin-button.scss';

const {Tooltip, Icon} = KalturaPlayer.ui.components;
const {withText, Text} = KalturaPlayer.ui.preacti18n;

const translates = ({isActive}: PluginButtonProps) => {
  return {
    label: isActive ? <Text id="playlist.hide-plugin">Hide Playlist</Text> : <Text id="playlist.show-plugin">Show Playlist</Text>
  };
};

interface PluginButtonProps {
  isActive: boolean;
  label?: string;
}

export const PluginButton = withText(translates)(({isActive, ...otherProps}: PluginButtonProps) => {
  return (
    <Tooltip label={otherProps.label} type="bottom">
      <button aria-label={otherProps.label} className={[styles.pluginButton, isActive ? styles.active : ''].join(' ')}>
        <Icon
          id="playlist-plugin-button"
          height={icons.BigSize}
          width={icons.BigSize}
          viewBox={`0 0 ${icons.BigSize} ${icons.BigSize}`}
          path={icons.PLUGIN_ICON}
        />
      </button>
    </Tooltip>
  );
});

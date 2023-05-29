import {h} from 'preact';
import {useRef, useEffect} from 'preact/hooks';
import {icons} from '../icons';
import * as styles from './playlist-header.scss';
import {A11yWrapper} from '@playkit-js/common/dist/hoc/a11y-wrapper';
import {PluginPositions} from '../../types';

const {Tooltip, Icon} = KalturaPlayer.ui.components;
const {withText, Text} = KalturaPlayer.ui.preacti18n;

const translates = ({}: PlaylistHeaderProps) => {
  return {
    closeButtonLabel: <Text id="playlist.hide_plugin">Hide Playlist</Text>
  };
};

interface PlaylistHeaderProps {
  closeButtonLabel?: string;
  toggledByKeyboard: boolean;
  onClose: () => void;
  title: string;
  amount: string;
  duration: string;
  pluginMode: PluginPositions;
}

export const PlaylistHeader = withText(translates)(
  ({onClose, title, amount, duration, pluginMode, toggledByKeyboard, ...otherProps}: PlaylistHeaderProps) => {
    const titleRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (toggledByKeyboard) {
        titleRef.current?.focus({preventScroll: true});
      }
    }, [toggledByKeyboard]);
    const durationText = `${amount},${duration}`;
    return (
      <div className={[styles.playlistHeader, pluginMode === PluginPositions.VERTICAL ? styles.vertical : styles.horizontal].join(' ')}>
        <div className={styles.playlistMetadata} tabIndex={0} ref={titleRef} aria-label={`${title} ${durationText}`}>
          <div className={styles.playlistTitle} title={title} aria-hidden="true">
            {title}
          </div>
          <div className={styles.playlistDuration} aria-hidden="true">
            {durationText}
          </div>
        </div>
        <div className={styles.closeButtonWrapper}>
          <Tooltip label={otherProps.closeButtonLabel} type="bottom">
            <A11yWrapper onClick={onClose}>
              <button aria-label={otherProps.closeButtonLabel} className={styles.closeButton}>
                <Icon
                  id="close-playlist-button"
                  height={icons.MediumSize}
                  width={icons.MediumSize}
                  viewBox={`0 0 ${icons.MediumSize} ${icons.MediumSize}`}
                  path={icons.CLOSE_ICON}
                />
              </button>
            </A11yWrapper>
          </Tooltip>
        </div>
      </div>
    );
  }
);

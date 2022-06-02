import {h} from 'preact';
import {icons} from '../icons';
import * as styles from './playlist-header.scss';
import {A11yWrapper} from '../a11y-wrapper';

const {Tooltip, Icon} = KalturaPlayer.ui.components;
const {withText, Text} = KalturaPlayer.ui.preacti18n;

const translates = ({}: PlaylistHeaderProps) => {
  return {
    closeButtonLabel: <Text id="playlist.hide-plugin">Hide Playlist</Text>
  };
};

interface PlaylistHeaderProps {
  closeButtonLabel?: string;
  onClose: () => void;
  title: string;
  amount: string;
  duration: string;
}

export const PlaylistHeader = withText(translates)(({onClose, title, amount, duration, ...otherProps}: PlaylistHeaderProps) => {
  return (
    <div className={styles.playlistHeader}>
      <div className={styles.playlistMetadata}>
        <div className={styles.playlistTitle}>{title}</div>
        <div className={styles.playlistDuration}>{`${amount}, ${duration}`}</div>
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
});

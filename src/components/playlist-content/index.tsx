import {h} from 'preact';
import {useCallback} from 'preact/hooks';
import * as styles from './playlist-content.scss';
import {A11yWrapper} from '../a11y-wrapper';

const {withText, Text} = KalturaPlayer.ui.preacti18n;

const translates = ({}: PlaylistContentProps) => {
  return {};
};

interface PlaylistContentProps {
  playlistItems: Array<any>; // TODO
  activeItem: number;
  onChange: (index: number) => void;
}

export const PlaylistContent = withText(translates)(({playlistItems, activeItem, onChange, ...otherProps}: PlaylistContentProps) => {
  const handleClick = useCallback(
    (index: number) => () => {
      onChange(index);
    },
    [playlistItems, onChange]
  );
  return (
    <div className={styles.playlistContent}>
      {playlistItems.map((item, index) => {
        const {sources} = item;
        return (
          <A11yWrapper onClick={handleClick(index)}>
            <div className={[styles.playlistItem, activeItem === index ? styles.active : ''].join(' ')}>
              <div className={styles.playlistItemIndex}>{index}</div>
              <div className={styles.playlistItemThumbnailWrapper} style={{backgroundImage: `url('${sources.poster}')`}}></div>
              <div className={styles.playlistItemMetadata}>{sources.metadata?.name}</div>
            </div>
          </A11yWrapper>
        );
      })}
    </div>
  );
});

import {h} from 'preact';
import {useCallback} from 'preact/hooks';
import * as styles from './playlist-wrapper.scss';
import {PlaylistHeader} from '../playlist-header';
import {PlaylistContent} from '../playlist-content';

const {Tooltip, Icon} = KalturaPlayer.ui.components;
const {withText, Text} = KalturaPlayer.ui.preacti18n;

const translates = ({player}: PlaylistWrapperProps) => {
  // @ts-ignore
  const amount = player.playlist?.items.length; // TODO: add player TS definition
  return {
    amount: (
      <Text
        id="playlist.amount-items"
        plural={amount}
        fields={{
          count: amount
        }}>{`${amount} videos`}</Text>
    )
  };
};

interface PlaylistWrapperProps {
  onClose: () => void;
  player: KalturaPlayerTypes.Player;
  eventManager: KalturaPlayerTypes.EventManager;
  amount?: string;
}

export const PlaylistWrapper = withText(translates)(({onClose, amount, player}: PlaylistWrapperProps) => {
  // @ts-ignore
  const {playlist} = player;

  const handlePlaylistItemClick = useCallback(
    (index: number) => {
      playlist.playItem(index);
    },
    [playlist]
  );

  return (
    <div className={styles.playlistWrapper}>
      <PlaylistHeader onClose={onClose} title={playlist.metadata?.name} amount={amount} duration={'1 hr 43 min'} />
      <PlaylistContent playlistItems={playlist.items} activeItem={playlist.current.index} onChange={handlePlaylistItemClick} />
    </div>
  );
});

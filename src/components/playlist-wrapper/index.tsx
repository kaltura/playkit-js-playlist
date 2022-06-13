import {h} from 'preact';
import {useCallback, useMemo} from 'preact/hooks';
import * as styles from './playlist-wrapper.scss';
import {PlaylistHeader} from '../playlist-header';
import {PlaylistItem} from '../playlist-item';
import {PluginPositions} from '../../types';

const {toHHMMSS} = KalturaPlayer.ui.utils;
const {withText, Text} = KalturaPlayer.ui.preacti18n;

const translates = ({player}: PlaylistWrapperProps) => {
  // @ts-ignore
  const amount: number = player.playlist?.items.length;
  return {
    amount: (
      <Text
        id="playlist.amount-items"
        plural={amount}
        fields={{
          count: amount
        }}>{`${amount} videos`}</Text>
    ),
    hour: <Text id="playlist.hour">hr</Text>,
    min: <Text id="playlist.min">min</Text>,
    sec: <Text id="playlist.sec">sec</Text>
  };
};

interface PlaylistWrapperProps {
  onClose: () => void;
  player: KalturaPlayerTypes.Player;
  pluginMode: PluginPositions;
  amount?: string;
  hour?: string;
  min?: string;
  sec?: string;
}

export const PlaylistWrapper = withText(translates)(({onClose, player, pluginMode, ...otherProps}: PlaylistWrapperProps) => {
  // @ts-ignore
  const {playlist} = player;

  const handlePlaylistItemClick = useCallback(
    (index: number) => () => {
      playlist.playItem(index);
    },
    [playlist]
  );

  const playlistDuration = useMemo(() => {
    const totalDuration = playlist.items.reduce((acc: number, cur: any) => {
      return acc + cur.sources.duration;
    }, 0);
    const convertedDuration = toHHMMSS(totalDuration).split(":");

    if (convertedDuration.length === 3) {
      return ` ${convertedDuration[0]} ${otherProps.hour} ${convertedDuration[1]} ${otherProps.min}`;
    }
    if (convertedDuration[0] !== '00') {
      return ` ${convertedDuration[0]} ${otherProps.min} ${convertedDuration[1]} ${otherProps.sec}`;
    }
    return ` ${convertedDuration[1]} ${otherProps.sec}`;
  }, [playlist]);

  return (
    <div className={[styles.playlistWrapper, pluginMode === PluginPositions.VERTICAL ? styles.vertical : styles.horizontal].join(' ')}>
      <PlaylistHeader
        onClose={onClose}
        title={playlist.metadata?.name}
        amount={otherProps.amount}
        duration={playlistDuration}
        pluginMode={pluginMode}
      />
      <div className={styles.playlistContent}>
        {playlist.items.map((item: any) => {
          const {index} = item;
          return (
            <PlaylistItem item={item} onSelect={handlePlaylistItemClick(index)} active={playlist.current.index === index} pluginMode={pluginMode} />
          );
        })}
      </div>
    </div>
  );
});

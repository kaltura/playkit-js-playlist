import {h} from 'preact';
import {useCallback, useMemo, useEffect, useState, useRef} from 'preact/hooks';
import * as styles from './playlist-wrapper.scss';
import {PlaylistHeader} from '../playlist-header';
import {PlaylistItem} from '../playlist-item';
import {PluginPositions, PlaylistExtraData} from '../../types';

const {toHHMMSS} = KalturaPlayer.ui.utils;
const {withText, Text} = KalturaPlayer.ui.preacti18n;

let scrollTimerId: ReturnType<typeof setTimeout>;
const SCROLL_BAR_TIMEOUT = 175;

const translates = ({player}: PlaylistWrapperProps) => {
  const amount = player.playlist?.items.length;
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
  playlistData: Promise<PlaylistExtraData>;
  amount?: string;
  hour?: string;
  min?: string;
  sec?: string;
}

export const PlaylistWrapper = withText(translates)(({onClose, player, pluginMode, playlistData, ...otherProps}: PlaylistWrapperProps) => {
  const {playlist} = player;
  const [playlistExtraData, setPlaylistExtraData] = useState<PlaylistExtraData>({});
  const [scrolling, setScrolling] = useState(false);
  const playlistContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playlistData.then(data => {
      setPlaylistExtraData(data);
    });
  }, []);

  const handlePlaylistItemClick = useCallback(
    (index: number) => () => {
      playlist.playItem(index);
    },
    [playlist]
  );

  const handleScroll = useCallback((e: Event) => {
    clearTimeout(scrollTimerId);
    setScrolling(true);
    scrollTimerId = setTimeout(() => {
      setScrolling(false);
    }, SCROLL_BAR_TIMEOUT);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (playlistContentRef?.current) {
      playlistContentRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  const playlistDuration = useMemo(() => {
    const totalDuration = playlist.items.reduce((acc: number, cur: any) => {
      return acc + cur.sources.duration;
    }, 0);
    const convertedDuration = toHHMMSS(totalDuration).split(':');

    if (convertedDuration.length === 3) {
      return ` ${convertedDuration[0]} ${otherProps.hour} ${convertedDuration[1]} ${otherProps.min}`;
    }
    if (convertedDuration[0] !== '00') {
      return ` ${convertedDuration[0]} ${otherProps.min} ${convertedDuration[1]} ${otherProps.sec}`;
    }
    return ` ${convertedDuration[1]} ${otherProps.sec}`;
  }, [playlist]);

  const renderPlaylistHeader = useMemo(() => {
    return (
      <PlaylistHeader
        onClose={onClose}
        title={playlist.metadata?.name}
        amount={otherProps.amount}
        duration={playlistDuration}
        pluginMode={pluginMode}
      />
    );
  }, [pluginMode, playlistDuration, onClose]);

  const playlistContentParams = useMemo(() => {
    if (pluginMode === PluginPositions.VERTICAL) {
      return {onScroll: handleScroll};
    }
    return {onWheel: handleWheel, ref: playlistContentRef};
  }, [pluginMode]);

  return (
    <div className={[styles.playlistWrapper, pluginMode === PluginPositions.VERTICAL ? styles.vertical : styles.horizontal].join(' ')}>
      {renderPlaylistHeader}
      <div className={[styles.playlistContent, scrolling ? styles.scrolling : ''].join(' ')} {...playlistContentParams}>
        {playlist.items.map((item: any) => {
          const {index} = item;
          return (
            <PlaylistItem
              item={item}
              onSelect={handlePlaylistItemClick(index)}
              active={playlist.current.index === index}
              pluginMode={pluginMode}
              viewHistory={playlistExtraData?.viewHistory?.[item.sources.id]}
              baseEntry={playlistExtraData?.baseEntry?.[item.sources.id]}
            />
          );
        })}
      </div>
    </div>
  );
});

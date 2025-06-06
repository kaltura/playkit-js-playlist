import {h} from 'preact';
import {useCallback, useMemo, useEffect, useState, useRef} from 'preact/hooks';
import {OnClick} from '@playkit-js/common/dist/hoc/a11y-wrapper';
import * as styles from './playlist-wrapper.scss';
import {PlaylistHeader} from '../playlist-header';
import {PlaylistItem} from '../playlist-item';
import {PluginPositions, PlaylistExtraData} from '../../types';
import { KalturaPlayer, ui, core } from '@playkit-js/kaltura-player-js';

const {toHHMMSS, KeyMap} = ui.utils;
const {withText, Text} = ui.preacti18n;

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
  toggledByKeyboard: boolean;
  onClose: OnClick;
  player: KalturaPlayer;
  pluginMode: PluginPositions;
  eventManager: core.EventManager;
  playlistData: Promise<PlaylistExtraData>;
  amount?: string;
  hour?: string;
  min?: string;
  sec?: string;
}

export const PlaylistWrapper = withText(translates)(
  ({onClose, player, pluginMode, playlistData, eventManager, toggledByKeyboard, ...otherProps}: PlaylistWrapperProps) => {
    const {playlist} = player;
    const [playlistExtraData, setPlaylistExtraData] = useState<PlaylistExtraData>({});
    const [activeIndex, setActiveIndex] = useState(playlist.current?.index);
    const playlistContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      playlistData.then(data => {
        setPlaylistExtraData(data);
      });
      eventManager.listen(player, core.EventType.CHANGE_SOURCE_ENDED, () => {
        setActiveIndex(playlist.current?.index);
      });
    }, []);

    const handlePlaylistItemClick = useCallback(
      (index: number) => () => {
        index === playlist.current?.index ? (player.currentTime = 0) : playlist.playItem(index);
      },
      [playlist]
    );

    const handleWheel = useCallback((e: WheelEvent) => {
      e.preventDefault();
      if (playlistContentRef?.current) {
        playlistContentRef.current.scrollLeft += e.deltaY;
      }
    }, []);

    const handleClose = useCallback(
      (event: KeyboardEvent) => {
        if (event.keyCode === KeyMap.ESC) {
          onClose(event, true);
        }
      },
      [onClose]
    );
    const playlistDuration = useMemo(() => {
      const totalDuration = playlist.items.reduce((acc: number, cur: any) => {
        return acc + (cur.sources.duration || 0);
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
          toggledByKeyboard={toggledByKeyboard}
        />
      );
    }, [pluginMode, playlistDuration, toggledByKeyboard, onClose]);

    const playlistContentParams = useMemo(() => {
      if (pluginMode === PluginPositions.VERTICAL) {
        return {
        };
      }
      return {
        onWheel: handleWheel,
        ref: playlistContentRef,
        tabIndex: 0,
      };
    }, [pluginMode]);

    return (
      <div
        data-testid={'playlist_root'}
        className={[styles.playlistWrapper, pluginMode === PluginPositions.VERTICAL ? styles.vertical : styles.horizontal].join(' ')}
        onKeyUp={handleClose}>
        {renderPlaylistHeader}
        <div
          className={[styles.playlistContent].join(' ')}
          {...playlistContentParams}
          aria-live="polite">
          {playlist.items.map((item: any) => {
            const {index} = item;
            return (
              <PlaylistItem
                item={item}
                onSelect={handlePlaylistItemClick(index)}
                active={activeIndex === index}
                pluginMode={pluginMode}
                viewHistory={playlistExtraData?.viewHistory?.[item.sources.id]}
                baseEntry={playlistExtraData?.baseEntry?.[item.sources.id]}
                multiLingual={playlistExtraData?.multiLingual?.[item.sources.id]}
                locale={player.config.ui.locale}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

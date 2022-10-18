import {h, Fragment} from 'preact';
import {useMemo} from 'preact/hooks';
// @ts-ignore
import {core} from 'kaltura-player-js';
import * as styles from './playlist-item.scss';
import {A11yWrapper} from '../a11y-wrapper';
import {icons} from '../icons';
import {PluginPositions} from '../../types';
import {KalturaViewHistoryUserEntry, KalturaBaseEntry, Capabilities} from '../../providers';

const {withText, Text} = KalturaPlayer.ui.preacti18n;
const {Icon} = KalturaPlayer.ui.components;
const {toHHMMSS} = KalturaPlayer.ui.utils;

const translates = ({}: PlaylistItemProps) => {
  return {
    quiz: <Text id="playlist.quiz_type">Quiz</Text>,
    live: <Text id="playlist.live_type">Live</Text>,
    toPlayAreaLabel: <Text id="playlist.play-item-area-label">Click to play:</Text>,
    currentlyPlaying: <Text id="playlist.currently-playing">Currently playing:</Text>,
    playlistItemIndex: <Text id="playlist.playlist-item-index">Playlist item #</Text>
  };
};

interface PlaylistItemProps {
  item: any; // TODO take difinition from KalturaPlayerTypes.Playlist
  active: boolean;
  onSelect: () => void;
  pluginMode: PluginPositions;
  viewHistory?: KalturaViewHistoryUserEntry;
  baseEntry?: KalturaBaseEntry;
  quiz?: string;
  live?: string;
  toPlayAreaLabel?: string;
  currentlyPlaying?: string;
  playlistItemIndex?: string;
}

export const PlaylistItem = withText(translates)(({item, active, onSelect, pluginMode, viewHistory, baseEntry, ...otherProps}: PlaylistItemProps) => {
  const {sources, index} = item;
  const playlistItemIndex = index + 1;
  const playlistItemName = sources.metadata?.name;
  const isVertical = useMemo(() => pluginMode === PluginPositions.VERTICAL, [pluginMode]);

  const lastProgress = useMemo(() => {
    if (!viewHistory?.lastTimeReached) {
      return 0;
    }
    const progress = (viewHistory?.lastTimeReached / sources.duration) * 100;
    return progress.toFixed();
  }, [sources, viewHistory]);

  const renderAddons = useMemo(() => {
    if (sources.type === core.MediaType.LIVE) {
      return <div className={styles.liveLabel}>{otherProps.live}</div>;
    }
    return (
      <Fragment>
        <div className={styles.playlistItemDuration}>{toHHMMSS(sources.duration)}</div>
        {lastProgress > 0 && (
          <div className={styles.playlistItemProgress}>
            <div className={styles.lastProgress} style={{width: `${lastProgress}%`}} />
          </div>
        )}
      </Fragment>
    );
  }, [sources, lastProgress]);

  const renderDescription = useMemo(() => {
    if (sources.type === core.MediaType.LIVE) {
      // TODO: get stream date
      return <div className={styles.playlistItemDescription}></div>;
    }
    if (baseEntry?.capabilities === Capabilities.Quiz) {
      return (
        <div className={styles.playlistItemDescription}>
          <div className={styles.iconContainer}>
            <Icon
              id="playlist-quiz-icon"
              height={icons.SmallSize}
              width={icons.SmallSize}
              viewBox={`0 0 ${icons.SmallSize} ${icons.SmallSize}`}
              path={icons.QUIZ_ICON}
              color="#cccccc"
            />
          </div>
          {otherProps.quiz}
        </div>
      );
    }
    return null;
  }, [sources, baseEntry]);

  const renderTitle = useMemo(() => {
    return (
      <Fragment>
        <div className={[styles.playlistItemTitle, renderDescription ? styles.hasDescription : ''].join(' ')} role="text">
          {isVertical ? playlistItemName : `${playlistItemIndex}. ${playlistItemName}`}
        </div>
        {renderDescription}
      </Fragment>
    );
  }, [playlistItemName, pluginMode, playlistItemIndex, renderDescription]);

  return (
    <A11yWrapper onClick={onSelect}>
      <div
        title={`${otherProps.playlistItemIndex}${index + 1}. ${
          active ? otherProps.currentlyPlaying : otherProps.toPlayAreaLabel
        } ${playlistItemName}`}
        className={[
          styles.playlistItem,
          isVertical ? styles.vertical : styles.horizontal,
          active ? styles.active : ''
        ].join(' ')}
        role="listitem"
        aria-label={playlistItemName}
        tabIndex={0}>
        {isVertical && (
          <div className={styles.playlistItemIndex} aria-hidden="true">
            {item.index + 1}
          </div>
        )}
        <div className={styles.playlistItemThumbnailWrapper} style={{backgroundImage: `url('${sources.poster}')`}} aria-hidden="true">
          <div className={styles.playlistItemAddons}>{renderAddons}</div>
        </div>
        <div className={styles.playlistItemMetadata}>{renderTitle}</div>
      </div>
    </A11yWrapper>
  );
});

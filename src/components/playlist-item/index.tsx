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
    live: <Text id="playlist.live_type">Live</Text>
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
}

export const PlaylistItem = withText(translates)(({item, active, onSelect, pluginMode, viewHistory, baseEntry, ...otherProps}: PlaylistItemProps) => {
  const {sources} = item;
  const lastProgress = useMemo(() => {
    if (!viewHistory?.lastTimeReached) {
      return 0;
    }
    const progress = (viewHistory?.lastTimeReached / sources.duration) * 100;
    return progress.toFixed(2);
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
    const {name} = sources.metadata;
    return (
      <Fragment>
        <div className={[styles.playlistItemTitle, renderDescription ? styles.hasDescription : ''].join(' ')} title={name}>
          {pluginMode === PluginPositions.VERTICAL ? name : `${item.index + 1}. ${name}`}
        </div>
        {renderDescription}
      </Fragment>
    );
  }, [sources, pluginMode, item, renderDescription]);

  return (
    <A11yWrapper onClick={onSelect}>
      <div
        className={[
          styles.playlistItem,
          pluginMode === PluginPositions.VERTICAL ? styles.vertical : styles.horizontal,
          active ? styles.active : ''
        ].join(' ')}
        role="button"
        tabIndex={0}>
        {pluginMode === PluginPositions.VERTICAL && <div className={styles.playlistItemIndex}>{item.index + 1}</div>}
        <div className={styles.playlistItemThumbnailWrapper} style={{backgroundImage: `url('${sources.poster}')`}}>
          <div className={styles.playlistItemAddons}>{renderAddons}</div>
        </div>
        <div className={styles.playlistItemMetadata}>{renderTitle}</div>
      </div>
    </A11yWrapper>
  );
});

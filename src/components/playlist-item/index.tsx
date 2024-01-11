import {h, Fragment} from 'preact';
import {useMemo} from 'preact/hooks';
// @ts-ignore
import {core} from '@playkit-js/kaltura-player-js';
import * as styles from './playlist-item.scss';
import {A11yWrapper} from '@playkit-js/common/dist/hoc/a11y-wrapper';
import {icons} from '../icons';
import {PluginPositions} from '../../types';
import {KalturaViewHistoryUserEntry, KalturaBaseEntry, Capabilities} from '../../providers';

const {withText, Text} = KalturaPlayer.ui.preacti18n;
const {Icon} = KalturaPlayer.ui.components;
const {toHHMMSS} = KalturaPlayer.ui.utils;

const PLACEHOLDER_IMAGE_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAASCAYAAAA6yNxSAAAAJklEQVR42u3OMQEAAAgDoJnc6BpjDyRgLrcpGgEBAQEBAQGBduABaVYs3Q5APwQAAAAASUVORK5CYII=';

const translates = ({}: PlaylistItemProps) => {
  return {
    quiz: <Text id="playlist.quiz_type">Quiz</Text>,
    live: <Text id="playlist.live_type">Live</Text>,
    image: <Text id="playlist.image_type">Image</Text>,
    document: <Text id="playlist.document_type">Document</Text>,
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
  image?: string;
  document?: string;
  toPlayAreaLabel?: string;
  currentlyPlaying?: string;
  playlistItemIndex?: string;
}

const MediaTypes = {
  Live: core.MediaType.LIVE,
  Image: core.MediaType.IMAGE,
  Document: 'Document' // TODO: import from core.MediaType.DOCUMENT
};

export const PlaylistItem = withText(translates)(({item, active, onSelect, pluginMode, viewHistory, baseEntry, ...otherProps}: PlaylistItemProps) => {
  const {sources, index} = item;
  const playlistItemIndex = index + 1;
  const playlistItemName = sources.metadata?.name;
  const duration = sources.duration || 0;

  const lastProgress = useMemo(() => {
    if (!viewHistory?.lastTimeReached) {
      return 0;
    }
    const progress = (viewHistory?.lastTimeReached / duration) * 100;
    return Number(progress.toFixed());
  }, [sources, viewHistory]);

  const renderAddons = useMemo(() => {
    const type = sources.mediaEntryType || sources.type;
    if ([MediaTypes.Image, MediaTypes.Document].includes(type)) {
      return null;
    }
    if (sources.mediaEntryType === MediaTypes.Live) {
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
    const type = sources.mediaEntryType || sources.type;
    if (type === MediaTypes.Live) {
      // TODO: get stream date
      return <div className={styles.playlistItemDescription}></div>;
    }
    if (type === MediaTypes.Image) {
      return (
        <div className={styles.playlistItemDescription}>
          <div className={styles.iconContainer}>
            <Icon
              fillRule="evenodd"
              id="playlist-image-icon"
              height={icons.SmallSize}
              width={icons.SmallSize}
              viewBox={`0 0 14 12`}
              path={icons.IMAGE_ICON}
              color="#cccccc"
            />
          </div>
          {otherProps.image}
        </div>
      );
    }
    if (type === MediaTypes.Document) {
      return (
        <div className={styles.playlistItemDescription}>
          <div className={styles.iconContainer}>
            <Icon
              fillRule="evenodd"
              id="playlist-document-icon"
              height={icons.SmallSize}
              width={icons.SmallSize}
              viewBox={`0 0 16 16`}
              path={icons.DOCUMENT_ICON}
              color="#cccccc"
            />
          </div>
          {otherProps.document}
        </div>
      );
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
        <div className={[styles.playlistItemTitle, renderDescription ? styles.hasDescription : ''].join(' ')}>
          {pluginMode === PluginPositions.VERTICAL ? playlistItemName : `${playlistItemIndex}. ${playlistItemName}`}
        </div>
        {renderDescription}
      </Fragment>
    );
  }, [playlistItemName, pluginMode, playlistItemIndex, renderDescription]);

  return (
    <A11yWrapper onClick={onSelect} role="listitem">
      <div
        title={`${otherProps.playlistItemIndex}${index + 1}. ${
          active ? otherProps.currentlyPlaying : otherProps.toPlayAreaLabel
        } ${playlistItemName}`}
        className={[
          styles.playlistItem,
          pluginMode === PluginPositions.VERTICAL ? styles.vertical : styles.horizontal,
          active ? styles.active : ''
        ].join(' ')}
        data-testid={'playlist_item'}
        aria-current={active}
        tabIndex={0}>
        {pluginMode === PluginPositions.VERTICAL && (
          <div className={styles.playlistItemIndex} aria-hidden="true">
            {item.index + 1}
          </div>
        )}
        <div className={styles.playlistItemThumbnailWrapper} style={{backgroundImage: `url('${sources.poster}')`}} aria-hidden="true">
          {/*for horizontal mode need to add image element in order to match width-height proportion*/}
          {pluginMode === PluginPositions.HORIZONTAL && (
            <img src={PLACEHOLDER_IMAGE_SRC} style={{width: 'auto', height: '100%', visibility: 'hidden'}} />
          )}
          <div className={styles.playlistItemAddons}>{renderAddons}</div>
        </div>
        <div className={styles.playlistItemMetadata}>{renderTitle}</div>
      </div>
    </A11yWrapper>
  );
});

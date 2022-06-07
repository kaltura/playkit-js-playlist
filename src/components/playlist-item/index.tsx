import {h, Fragment} from 'preact';
import {useMemo} from 'preact/hooks';
// @ts-ignore
import {core} from 'kaltura-player-js';
import * as styles from './playlist-item.scss';
import {A11yWrapper} from '../a11y-wrapper';
import {icons} from '../icons';
import {prepareTitle, prepareTime} from '../../utils';
import {PluginPositions} from '../../types';

const {withText, Text} = KalturaPlayer.ui.preacti18n;
const {Tooltip, Icon} = KalturaPlayer.ui.components;

const translates = ({}: PlaylistItemProps) => {
  return {
    quiz: <Text id="playlist.quiz_type">Quiz</Text>,
    live: <Text id="playlist.live_type">Live</Text>
  };
};

interface PlaylistItemProps {
  item: any; // TODO
  active: boolean;
  onSelect: () => void;
  pluginMode: PluginPositions;
  quiz?: string;
  live?: string;
}

export const PlaylistItem = withText(translates)(({item, active, onSelect, pluginMode, ...otherProps}: PlaylistItemProps) => {
  const {sources} = item;
  const lastProgress = 0; // TODO: make last progress

  const renderAddons = useMemo(() => {
    if (sources.type === core.MediaType.LIVE) {
      return <div className={styles.liveLabel}>{otherProps.live?.toLocaleUpperCase()}</div>;
    }
    return (
      <Fragment>
        <div className={styles.playlistItemDuration}>{prepareTime(sources.duration)}</div>
        {lastProgress > 0 && (
          <div className={styles.playlistItemProgress}>
            <div className={styles.lastProgress} style={{width: `${lastProgress}%`}} />
          </div>
        )}
      </Fragment>
    );
  }, [sources]);

  const renderDescription = useMemo(() => {
    if (sources.type === core.MediaType.LIVE) {
      // TODO: get stream date
      return <div className={styles.playlistItemDescription}>Date placeholder</div>;
    }
    // TODO: quiz icon placeholder
    if ('check if type is quiz') {
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
  }, [sources]);

  const renderTitle = useMemo(() => {
    const hasDescription = sources.type !== core.MediaType.VOD;
    const {name} = sources.metadata;
    return (
      <Fragment>
        <div className={[styles.playlistItemTitle, hasDescription ? styles.hasDescription : ''].join(' ')} title={name}>
          {hasDescription ? name : prepareTitle(pluginMode === PluginPositions.VERTICAL ? name : `${item.index + 1}. ${name}`)}
        </div>
        {hasDescription && renderDescription}
      </Fragment>
    );
  }, [sources, pluginMode, item]);

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

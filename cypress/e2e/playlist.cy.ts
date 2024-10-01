// @ts-expect-error Module '"@playkit-js/kaltura-player-js"' has no exported member 'core'
import {core} from '@playkit-js/kaltura-player-js';
import {mockKalturaBe, loadPlayer, MANIFEST, MANIFEST_SAFARI} from './env';

describe('Playlist plugin', () => {
  beforeEach(() => {
    // manifest
    cy.intercept('GET', '**/a.m3u8*', Cypress.browser.name === 'webkit' ? MANIFEST_SAFARI : MANIFEST);
    // thumbnails
    cy.intercept('GET', '**/width/164/vid_slices/100', {fixture: '100.jpeg'});
    cy.intercept('GET', '**/height/360/width/640', {fixture: '640.jpeg'});
    // kava
    cy.intercept('GET', '**/index.php?service=analytics*', {});
  });

  describe('plugin button and panel', () => {
    it('should open then close the Playlist side panel', () => {
      mockKalturaBe();
      loadPlayer().then(() => {
        cy.get('[data-testid="playlist_pluginButton"]').should('exist');
        cy.get('[data-testid="playlist_pluginButton"]').click({force: true});
        cy.get('[data-testid="playlist_root"]').should('exist');
        cy.get('[data-testid="playlist_root"]').should('have.css', 'visibility', 'visible');
        cy.get('[data-testid="playlist_closeButton"]').click({force: true});
        cy.get('[data-testid="playlist_root"]').should('have.css', 'visibility', 'hidden');
      });
    });
    it('should open the Playlist side panel if expandOnFirstPlay configuration is true', () => {
      mockKalturaBe();
      loadPlayer({expandOnFirstPlay: true}, {autoplay: true}).then(() => {
        cy.get('[data-testid="playlist_pluginButton"]').should('exist');
        cy.get('[data-testid="playlist_root"]').should('have.css', 'visibility', 'visible');
      });
    });
    it('should close plugin if ESC button pressed', () => {
      mockKalturaBe();
      loadPlayer({expandOnFirstPlay: true}, {autoplay: true}).then(() => {
        cy.get('[data-testid="playlist_root"]').should('be.visible');
        cy.get('[data-testid="playlist_root"]').type('{esc}');
        cy.get('[data-testid="playlist_root"]').should('have.css', 'visibility', 'hidden');
      });
    });
  });

  describe('playlist data', () => {
    it('should render playlist title and duration', () => {
      mockKalturaBe();
      loadPlayer({expandOnFirstPlay: true}, {autoplay: true}).then(() => {
        cy.get('[data-testid="playlist_title"]').should('exist');
        cy.get('[data-testid="playlist_title"]').should('have.text', 'new playlist');
        cy.get('[data-testid="playlist_duration"]').should('exist');
        cy.get('[data-testid="playlist_duration"]').should('have.text', '3 videos, 34 min 16 sec');
      });
    });
    it('should render 3 playlist items', () => {
      mockKalturaBe();
      loadPlayer({expandOnFirstPlay: true}, {autoplay: true}).then(() => {
        cy.get('[data-testid="playlist_item"]').should('have.length', 3);
      });
    });
  });

  describe('playlist navigation on click', () => {
    it('should navigate between playlist items on click', () => {
      mockKalturaBe();
      loadPlayer({expandOnFirstPlay: true}, {autoplay: true}).then(() => {
        cy.get('[data-testid="playlist_item"]').eq(0).should('have.attr', 'aria-current', 'true');
        cy.get('[data-testid="playlist_item"]').eq(2).should('have.attr', 'aria-current', 'false');
        cy.get('[data-testid="playlist_item"]').eq(2).click({force: true});
        cy.get('[data-testid="playlist_item"]').eq(0).should('have.attr', 'aria-current', 'false');
        cy.get('[data-testid="playlist_item"]').eq(2).should('have.attr', 'aria-current', 'true');
      });
    });

    it('should navigate between playlist items on keyboard press', () => {
      mockKalturaBe();
      loadPlayer({expandOnFirstPlay: true}, {autoplay: true}).then(() => {
        cy.get('[data-testid="playlist_item"]').eq(2).should('have.attr', 'aria-current', 'false');
        cy.get('[data-testid="playlist_item"]').eq(2).focus().type('{enter}');
        cy.get('[data-testid="playlist_item"]').eq(2).should('have.attr', 'aria-current', 'true');
      });
    });
  });

  describe('error handling', () => {
    it('should play next entry on error', () => {
      mockKalturaBe();
      loadPlayer({expandOnFirstPlay: true}, {autoplay: true}).then(kalturaPlayer => {
        cy.get('[data-testid="playlist_item"]').eq(0).should('have.attr', 'aria-current', 'true');
        const error = new core.Error(core.Error.Severity.CRITICAL, core.Error.Category.PLAYER, core.Error.Code.VIDEO_ERROR, {});
        kalturaPlayer.dispatchEvent(new core.FakeEvent(core.EventType.ERROR, error));
        cy.get('[data-testid="playlist_item"]').eq(0).should('have.attr', 'aria-current', 'false');
        cy.get('[data-testid="playlist_item"]').eq(1).should('have.attr', 'aria-current', 'true');
      });
    });
    it('should not play next entry on error if feature disabled', () => {
      mockKalturaBe();
      loadPlayer({expandOnFirstPlay: true, playNextOnError: false}, {autoplay: true}).then(kalturaPlayer => {
        cy.get('[data-testid="playlist_root"]')
          .should('exist')
          .then(() => {
            const error = new core.Error(core.Error.Severity.CRITICAL, core.Error.Category.PLAYER, core.Error.Code.VIDEO_ERROR, {});
            kalturaPlayer.dispatchEvent(new core.FakeEvent(core.EventType.ERROR, error));
            cy.get('[data-testid="playlist_root"]').should('not.exist');
          });
      });
    });
  });
});

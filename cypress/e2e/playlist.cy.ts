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
});
